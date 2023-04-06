// Display for messages
import { useState, useEffect } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Message, Room } from "../../globals/types";
import { useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/components/userBar";
import MessageBox from "../ThreadComponents/messageBox";
import { addCourseModsURL, getCourseManagementURL, getCourseModsURL } from "../../API/CourseManagementAPI";
import BanDialog from "../ThreadComponents/BanDialog";
import WarningDialog from "../ThreadComponents/WarningDialog";
import { MessageEntry } from "../ThreadComponents/MessageEntry";
import ClearIcon from "@mui/icons-material/Clear";
import { Paper } from "@mui/material";
import RoomDisplayAppBar from "./CourseDisplayAppBar";
import SearchCourseModal from "./searchCourseModal";
import { APP_STYLES } from "../../globals/globalStyles";
import useUserRoomData from "../HomePage/hooks/useUserRoomData";
import useStore from "./../../store/store";
import { getRoomURL } from "../../API/CoursesAPI";
import React from "react";

type WarnOrBan = {
  username: string;
  reason: string;
}; // date to String representation of date (January 6, 2023, 12:00 PM)
const dateStringify = (dateTime: string) => {
  const date = new Date(dateTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const time = armyToRegTime(dateTime);
  return `${month}/${day}/${year}, ${time}`;
};

const armyToRegTime = (time: any) => {
  const clock = time.split(" ");
  const [hours, minutes, seconds] = clock[1].split(":").map(Number);
  let timeValue = hours > 0 && hours <= 12 ? "" + hours : hours > 12 ? "" + (hours - 12) : "12";
  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " P.M." : " A.M.";
  return timeValue;
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

  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  const { profile } = useAuth();
  // const [messages, setMessagesL] = useState<Message[]>(null);
  const [showCourses, setShowCourses] = useState(false);
  const [emojiShow, setEmojiShow] = useState<boolean>(false);
  const [currentCourse, currentRoom, setCurrentRoom, messages, setMessages, userCourseList, setCurrentCourse, setActiveCourseThread] = useStore((state) => [
    state.currentCourse,
    state.currentRoom,
    state.setCurrentRoom,
    state.messages,
    state.setMessages,
    state.userCourseList,
    state.setCurrentCourse,
    state.setActiveCourseThread,
  ]);

  // get course management
  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          // setCourseData(resData);
          resData?.bannedUsers.forEach((item) => {
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
    const course = userCourseList?.find((course) => course._id.$oid === courseId);
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
          const course = userCourseList?.find((course) => course._id.$oid === courseId);
          setActiveCourseThread(resData.name.replace(course.name, ""));
          setMessages(resData.messages);
        }
      }
    };
    fetchCurrentRoom();
  }, [roomId]);

  // useEffect(() => {
  //   setActiveCourseThread(currentRoom.name.replace(currentCourse.name, ""));
  // }, [currentRoom]);



  const searchCourseProps = {
    showCourses,
    setShowCourses,
  };

  return (
    <Paper sx={{ height: "100%", width: "100%" }} id="room">
      <SearchCourseModal {...searchCourseProps} />

      <RoomDisplayAppBar {...searchCourseProps} />
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
          {banned ? <BanDialog bannedData={bannedData} appealData={appealData} /> : <WarningDialog setWarned={setWarned} warnedData={warnedData} />}
        </Box>
      )}
      {!banned && !warned && (
        <Box sx={{ height: "100%", width: "100%" }}>
          <MessageListContainer messages={messages} />
        </Box>
      )}
    </Paper>
  );
};

const MessageBoxContainer = ({ isReplying, handleReply, replyIndex, updateReaction, reaction, messages }) => {
  const containerProps = {
    isReplying,
    handleReply,
    replyIndex,
    updateReaction,
    reaction,
  };
  return (
    <Box
      sx={{
        height: `${APP_STYLES.APP_BAR_HEIGHT}px`,
        position: "absolute",
        bottom: 20,
        right: `${APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH + 3 * 8}px`,
        left: `${APP_STYLES.DRAWER_WIDTH}px`,
      }}
    >
      <MessageBoxItems {...containerProps} messages={messages} />
    </Box>
  );
};
const MessageBoxItems = ({ isReplying, handleReply, replyIndex, updateReaction, reaction, messages }) => {
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
            {`replying to ` + messages[replyIndex].username + `: ` + messages[replyIndex].message}
          </Typography>
        </Box>
      ) : null}
      <MessageBox replyIndex={replyIndex} handleReply={handleReply} {...{ updateReaction, reaction, messages }} />
    </Box>
  );
};

const MessageListContainer = ({ messages }) => {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyIndex, setReplyIndex] = useState<number>(null);
  const [reaction, setReaction] = useState<{ reaction: string; index: number } | null>(null);
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

  function handleReply(isReplying, index) {
    setIsReplying(isReplying);
    if (isReplying) {
      setReplyIndex(index);
    } else {
      setReplyIndex(null);
    }
  }
  const updateReaction = (reaction: string, index: number) => {
    if (reaction === null && index === null) {
      setReaction(null);
      return;
    }
    setReaction({ reaction, index });
  };
  const messageBoxProps = {
    isReplying,
    handleReply,
    replyIndex,
    updateReaction,
    reaction,
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        id="message-container"
        sx={{
          p: APP_STYLES.DEFAULT_PADDING,
          width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
          maxHeight: `calc(100% - ${APP_STYLES.APP_BAR_HEIGHT * 2 + 30}px)`,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          scrollBehavior: "smooth",
        }}
        className="scrollBar"
      >
        <MessagesList {...messageBoxProps} messages={messages} />
      </Box>
      <MessageBoxContainer {...messageBoxProps} messages={messages} />
    </Box>
  );
};

const MessagesList = ({ isReplying, handleReply, replyIndex, updateReaction, reaction, messages }) => {
  const { user, profile } = useAuth();
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const [profilePicLastUpdated, setProfilePicLastUpdated] = useState<number>(Date.now());
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    //update profile pic every 5 minutes
    const interval = setInterval(() => {
      setProfilePicLastUpdated(Date.now());
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const setCurrentRoomMods = async (username: string) => {
    // return await axiosPrivate.get(getCourseModsURL + courseId);
    return await axiosPrivate.post(addCourseModsURL + username + "/" + currentCourse._id.$oid);
  };

  const ConditionalLineBreak = ({ index }) => {
    if (messages?.length - 1 === index || messages?.length === 0) {
      return null;
    }
    const messageDate = dateStringify(messages[index + 1]?.timeSent);

    let messageTime = new Date(messages[index]?.timeSent);
    let messageTime2 = new Date(messages[index + 1]?.timeSent);
    // if message 2 is the next day
    if (messageTime2.getDate() > messageTime.getDate()) {
      return (
        <Divider
          sx={{
            paddingBottom: "10px",
            textAlign: "center",
          }}
        >
          <Typography variant="overline">{messageDate}</Typography>
        </Divider>
      );
    }

    return null;
  };

  return messages?.length > 0 ? (
    <Box>
      <Typography variant="h4" paddingBottom={"5px"}>
        Messages
      </Typography>
      <Box>
        {messages?.slice().map((message, index) => {
          //displays messages

          return user?.blockedUsers.includes(message.username) ? null : (
            <Box key={index} sx={{ paddingBottom: "12px" }}>
              <MessageEntry
                profilePicLastUpdated={profilePicLastUpdated}
                messages={messages}
                message={message}
                index={index}
                isReply={(isReplying) => handleReply(isReplying, index)}
                //SamNote: Return Here
                isRoomMod={profile?.modThreads?.includes(currentCourse?.name) || profile?.username == "user2"}
                promoteUser={setCurrentRoomMods}
                addReaction={updateReaction}
                course={currentCourse}
              />
              <ConditionalLineBreak index={index} />

              {/* {isReplying ? setReplyIndex(index) : null} */}
              {/* room={currentRoom} 
                        
                        ||
                            getCurrentRoomMods(courseId).includes(
                              profile?.username
                            ) */}
            </Box>
          );
        })}
      </Box>
    </Box>
  ) : (
    <Box>{messages ? <Typography variant="h6">No messages yet!</Typography> : <Typography>Loading...</Typography>}</Box>
  );
};
export default React.memo(RoomDisplay);
