// Display for messages
import { useState, useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../types/types";
import { useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/userBar";
import MessageBox from "../HomePage/messageBox";
import { getCourseManagementURL } from "../../API/CourseManagementAPI";
import BanDialog from "../ThreadComponents/BanDialog";
import WarningDialog from "../ThreadComponents/WarningDialog";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import BlockIcon from "@mui/icons-material/Block";
import { blockUserUrl } from "../../API/BlockingAPI";
import BlockUserModal from "../HomePage/blockUserModal";
import { MessageEntry } from "../ThreadComponents/MessageEntry";

type Props = {
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  defaultPadding: number;
  distinctCoursesByDepartment: Course[];
  setDistinctCoursesByDepartment: React.Dispatch<React.SetStateAction<Course[]>>;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveCourseThread: React.Dispatch<React.SetStateAction<string>>;
  courseUsers: [{ username: string; profilePic: string }];
};

type WarnOrBan = {
  username: string;
  reason: string;
}; // date to String representation of date (Monday, 12:00 PM)
const dateStringify = (dateTime: string) => {
  let date = new Date(dateTime);
  let day = date.toLocaleString("en-us", { weekday: "long" });
  let time = date.toLocaleString("en-us", { hour: "numeric", minute: "numeric", hour12: true });
  return day + ", " + time;
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
  const { messages, setMessages, sendMessage, connectToRoom, disconnectFromRoom, isConnected } = useSockets();
  const messageBoxProps = {
    messages,
    setMessages,
    sendMessage,
    connectToRoom,
    disconnectFromRoom,
  };
  const { courseId, roomId } = useParams();
  const { roomProps } = useOutletContext<{
    roomProps: Props;
  }>();
  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  // const [courseData, setCourseData] = useState<CourseManagement>(null);
  // const navigate = useNavigate();
  const [userToBlock, setUserToBlock] = useState<string>("");
  const [showBlockUser, setShowBlockUser] = useState<boolean>(false);

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
    // if (roomProps.currentCourse) {
    fetchCourseManagement();
    // }
  }, [roomProps.currentCourse]);

  // whens messages change, scroll to bottom
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      //if scroll is close to bottom, scroll to bottom
      if (messageContainer.scrollHeight - messageContainer.scrollTop < messageContainer.clientHeight + 100) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }
  }, [messages]);

  const getCurrentRoomMessages = () => {
    //find room in currentCourse since currentRoom messages are not updated
    let foundRoom: Room;
    roomProps.currentCourse?.rooms.forEach((room) => {
      if (room.name === roomProps.currentRoom?.name) {
        foundRoom = room;
      }
    });
    return foundRoom ? foundRoom.messages : [];
  };

  useEffect(() => {
    if (roomProps.currentRoom) {
      assignMessages(roomProps.currentRoom);
      roomProps.setActiveCourseThread(roomProps.currentRoom?.name.replace(roomProps.currentCourse?.name, ""));
    }
  }, [roomProps.currentRoom]);

  const HandleLineBreak = ({ index }) => {
    let messages = getCurrentRoomMessages();
    if (messages.length - 1 === index || messages.length === 0) {
      return null;
    }
    const messageDate = dateStringify(messages[index + 1]?.timeSent);

    let messageTime = armyToRegTime(messages[index]?.timeSent)?.split(" ")[1];
    let messageTime2 = armyToRegTime(messages[index + 1]?.timeSent)?.split(" ")[1];

    if (messageTime === "P.M." && messageTime2 === "A.M.") {
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

  const assignMessages = (room: Room) => {
    //find room in userCourses since currentRoom messages are not updated
    let foundRoom: Room;
    roomProps.userCourses?.forEach((course) => {
      course.rooms.forEach((room) => {
        if (room._id.$oid === roomProps.currentRoom?._id.$oid) {
          foundRoom = room;
        }
      });
    });

    const newMessages = foundRoom?.messages.map((message) => {
      const newMessage = {
        username: message.username,
        message: message.message,
        timeSent: message.timeSent,
        profilePic: message.profilePic,
      };
      return newMessage;
    });
    setMessages(newMessages);
  };

  // const handleBlockUser = async (userToBlock) => {
  //   console.log("blocking user " + userToBlock);
  //   return await axiosPrivate.post(blockUserUrl, {toBlock: userToBlock, username: user.username});
  // };

  const blockUserProps = {
    requestUsername: user.username,
    userToBlock, 
    showBlockUser,
    setShowBlockUser,
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }} id="room">
      <BlockUserModal {...blockUserProps} />
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
          <Box
            id="message-container"
            sx={{
              p: roomProps.defaultPadding,
              width: `calc(100% - ${roomProps.drawerWidth}px)`,
              maxHeight: `calc(100% - ${roomProps.appBarHeight * 2 + 30}px)`,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              scrollBehavior: "smooth",
            }}
            className="scrollBar"
          >
            {getCurrentRoomMessages().length > 0 ? (
              <Box>
                <Typography variant="h4" paddingBottom={"5px"}>
                  Messages
                </Typography>
                <Box>
                  {getCurrentRoomMessages().map((message, index) => {
                    //displays messages
                    return (
                      <Box key={index}>
                        <MessageEntry message={message} index={index} />
                        <HandleLineBreak index={index} />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">No messages yet!</Typography>
            )}
          </Box>
          <UserBar {...roomProps} />
          <Box
            sx={{
              height: `${roomProps.appBarHeight}px`,
              position: "absolute",
              bottom: 20,
              right: `${roomProps.drawerWidth - roomProps.innerDrawerWidth + 3 * 8}px`,
              left: `${roomProps.drawerWidth}px`,
            }}
          >
            {/** Message box only renders once socket is connected */}
            {isConnected ? <MessageBox {...roomProps} {...messageBoxProps} /> : <Typography variant="h6">Loading...</Typography>}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDisplay;
