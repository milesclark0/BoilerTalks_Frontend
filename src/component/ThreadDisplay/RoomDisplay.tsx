// Display for messages
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Message, Room } from "../../globals/types";
import { useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/components/userBar";
import MessageBox from "../ThreadComponents/messageBox";
import {
  addCourseModsURL,
  getCourseManagementURL,
  getCourseModsURL,
} from "../../API/CourseManagementAPI";
import BanDialog from "../ThreadComponents/BanDialog";
import WarningDialog from "../ThreadComponents/WarningDialog";
import MessageEntry from "../ThreadComponents/MessageEntry";
import ClearIcon from "@mui/icons-material/Clear";
import { Paper } from "@mui/material";
import CourseDisplayAppBar from "./CourseDisplayAppBar";
import { APP_STYLES } from "../../globals/globalStyles";
import useUserRoomData from "../HomePage/hooks/useUserRoomData";
import useStore from "./../../store/store";
import { getRoomURL } from "../../API/CoursesAPI";
import { updateLastSeenMessageURL } from "../../API/ProfileAPI";
import { useCourseUsers } from "../HomePage/hooks/useCourseUsers";
import { VariableSizeList as List } from "react-window";
import { PollPromptBox, ShowPollList } from "../Messages/poll";

type WarnOrBan = {
  username: string;
  reason: string;
};

type Appeal = {
  username: string;
  response: string;
  reason: string;
  reviewed: boolean;
  unban: boolean;
};

const RoomDisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { courseId, roomId } = useParams();
  const [bannedUsers, setBannedUsers] = useState<string[]>(null);
  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  const { setProfile, profile } = useAuth();
  // const [messages, setMessagesL] = useState<Message[]>(null);
  const [emojiShow, setEmojiShow] = useState<boolean>(false);

  const [showPollBox, setShowPollBox] = useState<boolean>(false);

  const [
    currentCourse,
    currentRoom,
    setCurrentRoom,
    messages,
    setMessages,
    userCourseList,
    setCurrentCourse,
    setActiveCourseThread,
  ] = useStore((state) => [
    state.currentCourse,
    state.currentRoom,
    state.setCurrentRoom,
    state.messages,
    state.setMessages,
    state.userCourseList,
    state.setCurrentCourse,
    state.setActiveCourseThread,
  ]);
  useUserRoomData();
  useCourseUsers();

  // get course management
  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          // console.log(resData)
          const userBanned = [];
          resData?.bannedUsers.forEach((item) => {
            userBanned.push(item.username);
            if (item.username === user?.username) {
              // find if user has sent an appeal
              resData?.appeals.forEach((appeal) => {
                if (appeal.username === user?.username) {
                  setAppealData(appeal);
                }
              });
              setBanned(true);
              setBannedData(item);
            }
          });
          setBannedUsers(userBanned);
          resData?.warnedUsers.forEach((item) => {
            if (item.username === user?.username) {
              setWarned(true);
              setWarnedData(item);
            }
          });
        }
      }
    };
    fetchCourseManagement();
  }, [courseId]);

  useEffect(() => {
    const course = userCourseList?.find(
      (course) => course._id.$oid === courseId
    );
    setCurrentCourse(course);
  }, [courseId]);

  //fetch currentRoom to update it
  useEffect(() => {
    const fetchCurrentRoom = async () => {
      console.log("fetching current room", roomId);
      const res = await axiosPrivate.get(getRoomURL + roomId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          setCurrentRoom(resData);
          const course = userCourseList?.find(
            (course) => course._id.$oid === courseId
          );
          setActiveCourseThread(resData.name.replace(course.name, ""));
          setMessages(resData.messages);
        }
      }
    };
    fetchCurrentRoom();
  }, [roomId]);

  useEffect(() => {
    if (messages == null) {
      return;
    }

    updateLastSeenMessage();
  }, [messages]);

  const updateLastSeenMessage = async () => {
    if (messages[messages.length - 1] == undefined || profile == undefined) {
      return;
    }
    console.log("updating last seen message", roomId);
    const data = {
      roomId: roomId,
      data: {
        courseName: currentCourse?.name,
        message: {
          username: messages[messages.length - 1]["username"],
          timeSent: messages[messages.length - 1]["timeSent"],
        },
      },
    };
    const res = await axiosPrivate.post(
      updateLastSeenMessageURL + user?.username,
      data
    );
    console.log(res);
    if (res.status == 200) {
      if (res.data.statusCode == 200) {
        const newProfile = profile;
        newProfile.lastSeenMessage = res.data.data;
        // console.log(res.data.data, profile);
        setProfile(newProfile);
      }
    }
  };

  function toggleShowPollBox() {
    setShowPollBox(!showPollBox);
  }

  // useEffect(() => {
  //   setActiveCourseThread(currentRoom.name.replace(currentCourse.name, ""));
  // }, [currentRoom]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }} id="room">
      <CourseDisplayAppBar />
      {(banned || warned) && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {banned ? (
            <BanDialog bannedData={bannedData} appealData={appealData} />
          ) : (
            <WarningDialog setWarned={setWarned} warnedData={warnedData} />
          )}
        </Box>
      )}
      {!banned && !warned && (
        <Box sx={{ height: "100%", width: "100%" }}>
          <MessageListContainer
            messages={messages}
            bannedUsers={bannedUsers}
            toggleShowPollBox={toggleShowPollBox}
            isShowPollBox={showPollBox}
          />
        </Box>
      )}
    </Paper>
  );
};

const MessageBoxContainer = ({
  isReplying,
  handleReply,
  replyId,
  editId,
  isEditing,
  handleEdit,
  updateReaction,
  reaction,
  messages,
  toggleShowPollBox,
}) => {
  const containerProps = {
    isReplying,
    handleReply,
    replyId,
    editId,
    isEditing,
    handleEdit,
    updateReaction,
    reaction,
    toggleShowPollBox,
  };
  return (
    <Box
      sx={{
        height: `${APP_STYLES.APP_BAR_HEIGHT}px`,
        position: "absolute",
        bottom: 20,
        right: `${
          APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH + 3 * 8
        }px`,
        left: `${APP_STYLES.DRAWER_WIDTH}px`,
      }}
    >
      <MessageBoxItems {...containerProps} messages={messages} />
    </Box>
  );
};

const MessageBoxItems = ({
  isReplying,
  handleReply,
  replyId,
  editId,
  isEditing,
  handleEdit,
  updateReaction,
  reaction,
  messages,
  toggleShowPollBox,
}) => {
  const replyIndex = messages?.findIndex(
    (message) =>
      message.timeSent === replyId?.id && message.username === replyId?.username
  );
  return (
    <Box>
      {isReplying ? (
        <Box
          sx={{
            width: "50%",
            display: "flex",
            transform: "translateX(5%)",
            overflow: "hidden",
          }}
        >
          <IconButton onClick={() => handleReply(false, null)}>
            <ClearIcon />
          </IconButton>
          <Typography variant="overline">
            {/* <ReplyIcon /> */}
            {`replying to ` +
              messages[replyIndex]?.username +
              `: ` +
              messages[replyIndex]?.message}
          </Typography>
        </Box>
      ) : null}

      {isEditing ? (
        <Box
          sx={{
            width: "50%",
            display: "flex",
            transform: "translateX(5%)",
            overflow: "hidden",
          }}
        >
          <IconButton onClick={() => handleEdit(false, null)}>
            <ClearIcon />
          </IconButton>
          <Typography variant="overline">
            {/* <ReplyIcon /> */}
            {`Editing message: `}
          </Typography>
        </Box>
      ) : null}
      <MessageBox
        toggleShowPollBox={toggleShowPollBox}
        replyId={replyId}
        handleReply={handleReply}
        editId={editId}
        handleEdit={handleEdit}
        isEditing={isEditing}
        {...{ updateReaction, reaction, messages }}
      />
    </Box>
  );
};

const MessageListContainer = ({
  messages,
  bannedUsers,
  toggleShowPollBox,
  isShowPollBox,
}) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [replyId, setReplyId] = useState<{ id: string; username: string }>(
    null
  );
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const [editId, setEditId] = useState<number>(null);
  const [reaction, setReaction] = useState<{
    reaction: string;
    index: number;
  } | null>(null);
  // whens messages change, scroll to bottom
  // useEffect(() => {
  //   const messageContainer = document.getElementById("message-container");
  //   if (messageContainer) {
  //     //if scroll is close to bottom, scroll to bottom
  //     if (messageContainer.scrollHeight - messageContainer.scrollTop < messageContainer.clientHeight + 100) {
  //       messageContainer.scrollTop = messageContainer.scrollHeight;
  //     }
  //   }
  //   console.log("messages changed");
  // }, [messages]);

  const handleReply = useCallback((isReplying, index) => {
    const message = messages[index];
    const messageUser = message?.username;
    const messageId = message?.timeSent;
    setIsReplying(isReplying);
    if (isReplying) {
      console.log("replying to", messageUser, messageId);
      setReplyId({ id: messageId, username: messageUser });
    } else {
      setReplyId(null);
    }
  }, []);

  const handleEdit = useCallback((isEditing, index) => {
    const message = messages[index];
    const messageUser = message?.username;
    const messageId = message?.timeSent;
    setIsEditing(isEditing);
    if (isEditing) {
      console.log("editing ", messageUser, messageId);
      setEditId(index);
    } else {
      setEditId(null);
    }
  }, []);

  const updateReaction = useCallback((reaction: string, index: number) => {
    if (reaction === null && index === null) {
      setReaction(null);
      return;
    }
    setReaction({ reaction, index });
  }, []);
  const messageBoxProps = {
    isReplying,
    handleReply,
    replyId,
    editId,
    isEditing,
    handleEdit,
    updateReaction,
    reaction,
    bannedUsers,
    toggleShowPollBox,
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        id="message-container"
        sx={{
          p: APP_STYLES.DEFAULT_PADDING,
          width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
          maxHeight: `calc(100% - ${APP_STYLES.APP_BAR_HEIGHT * 2 + 30}px)`,
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          scrollBehavior: "smooth",
        }}
        className="scrollBar"
      >
        {isShowPollBox ? (
          <React.Fragment>
            <PollPromptBox toggleShowPollBox={toggleShowPollBox} />
          </React.Fragment>
        ) : (
          <MessagesList {...messageBoxProps} messages={messages} />
        )}
      </Box>
      <MessageBoxContainer {...messageBoxProps} messages={messages} />
      <UserBar />
    </Box>
  );
};

const MessagesList = ({
  handleReply,
  handleEdit,
  updateReaction,
  messages,
}) => {
  const { profile } = useAuth();
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const [profilePicLastUpdated, setProfilePicLastUpdated] = useState<number>(
    Date.now()
  );
  const axiosPrivate = useAxiosPrivate();
  const { roomId } = useParams();
  const listRef = useRef(null);

  // useEffect(() => {
  //   //update profile pic every 5 minutes
  //   const interval = setInterval(() => {
  //     setProfilePicLastUpdated(Date.now());
  //   }, 300000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (listRef.current) {
      //scroll to bottom and resize list entries
      listRef.current.resetAfterIndex(0, true);
      listRef.current.scrollToItem(messages.length - 1, { align: "bottom" });
    }
  }, [messages[0]]);

  const getItemSize = (index: number) => {
    const message = messages[index];
    // Compute the height of the message based on its contents
    // You can use any algorithm that suits your needs
    // Here's an example based on the message text length
    const lineHeight = 40; // You can adjust this value to match your font size
    const emojiSpace = message?.reactions?.length > 0 ? 45 : 0; // Add some extra space for emojis
    const reply = Number.isInteger(message.replyIndex) ? 40 : 0;
    const linesCount = Math.ceil(message?.message.length / 140); // Break lines every 50 characters
    const finalHeight =
      linesCount * lineHeight +
      40 +
      getDividerHeight(index) +
      emojiSpace +
      reply; // Add some extra space for the message container
    // console.log(index, linesCount, getDividerHeight(index), finalHeight);
    return finalHeight;
  };

  const setCurrentRoomMods = useCallback(
    async (username: string) => {
      // return await axiosPrivate.get(getCourseModsURL + courseId);
      return await axiosPrivate.post(
        addCourseModsURL + username + "/" + currentCourse._id.$oid
      );
    },
    [currentCourse?._id.$oid]
  );

  const getDividerHeight = (index: number) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const message = messages[index];
    const messageBefore = messages[index - 1];
    if (!messageBefore) {
      return 31;
    }
    const messageTime = new Date(message.timeSent);
    const messageBeforeTime = new Date(messageBefore.timeSent);
    // console.log(messageTime.toLocaleDateString(undefined, options), messageBeforeTime.toLocaleDateString(undefined, options));

    const isSameDay =
      messageTime.toLocaleDateString(undefined, options) ===
      messageBeforeTime.toLocaleDateString(undefined, options);
    // console.log(message.message, !isSameDay ? "has a divider" : "does not have a divider");

    return isSameDay ? 0 : 31;
  };

  const ConditionalLineBreak = ({ index }) => {
    //console.log(profile?.lastSeenMessage[roomId]?.message.timeSent, messages?.[index]?.timeSent);
    const theme = useTheme();
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    if (messages?.length === 0) {
      return null;
    }

    const msgDateBefore = new Date(
      messages[index - 1]?.timeSent
    ).toLocaleDateString(undefined, options);
    const msgDateAfter = new Date(messages[index]?.timeSent).toLocaleDateString(
      undefined,
      options
    );

    //render new message divider if message before is the last seen message
    if (
      profile?.lastSeenMessage[roomId]?.message.timeSent ===
      messages[index - 1]?.timeSent
    ) {
      return (
        <div
          style={{
            paddingBottom: "10px",
            color: theme.palette.error.main,
          }}
        >
          <Divider>
            <Typography variant="overline">{msgDateAfter} (New)</Typography>
          </Divider>
        </div>
      );
    }
    // if message after is the next day
    if (msgDateBefore === undefined || msgDateAfter !== msgDateBefore) {
      return (
        <div
          style={{
            paddingBottom: "10px",
          }}
        >
          <Divider>
            <Typography variant="overline">{msgDateAfter}</Typography>
          </Divider>
        </div>
      );
    }
    return null;
  };

  const Row = ({ index, style }) => {
    const message = messages[index];
    const isReply = useCallback(
      (isReplying: boolean) => {
        handleReply(isReplying, index);
      },
      [handleReply]
    );
    const isEdit = useCallback(
      (isEditing: boolean) => {
        handleEdit(isEditing, index);
      },
      [handleEdit]
    );
    const MessageEntryProps = {
      profilePicLastUpdated,
      messages,
      message,
      index,
      isReply,
      isEdit,
      isRoomMod:
        profile?.modThreads?.includes(currentCourse?.name) ||
        profile?.username == "user2",
      promoteUser: setCurrentRoomMods,
      addReaction: updateReaction,
      course: currentCourse,
    };
    // Render a message entry using the message data
    return (
      <div
        key={message.username + message.timeSent}
        style={{ ...style, scrollBehavior: "smooth" }}
      >
        <ConditionalLineBreak index={index} />
        <MessageEntry {...MessageEntryProps} />
      </div>
    );
  };

  return (
    <div>
      <Typography variant="h4" paddingBottom={"5px"}>
        Messages
      </Typography>
      {messages?.length > 0 ? (
        <List
          height={850} // set the height of the list
          itemCount={messages?.length} // set the number of items in the list
          itemSize={getItemSize}
          estimatedItemSize={100} // set the height of each item in the list
          width="100%" // set the width of the list
          ref={listRef}
          style={{ overflowX: "hidden" }}
          className="scrollBar"
        >
          {Row}
        </List>
      ) : (
        <Box>
          {messages ? (
            <Typography variant="h6">No messages yet!</Typography>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      )}
    </div>
  );
};
export default React.memo(RoomDisplay);
