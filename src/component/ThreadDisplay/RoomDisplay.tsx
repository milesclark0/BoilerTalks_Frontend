import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room, Message } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/userBar";
import MessageBox from "../HomePage/messageBox";
import { getBannedUsersURL } from "../../API/CoursesAPI";
import BanDialog from "../SideBar/CourseView/BanDialog";
import WarningDialog from "../SideBar/CourseView/WarningDialog";

type Props = {
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (
    message: { username: string; message: string; timeSent: string },
    room: Room,
    isSystemMessage: boolean
  ) => void;
  connectToRoom: (room: Room) => void;
  disconnectFromRoom: (room: Room) => void;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
};

const RoomDisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const {
    message,
    setMessage,
    messages,
    setMessages,
    sendMessage,
    connectToRoom,
    disconnectFromRoom,
  } = useSockets();
  const { courseId } = useParams();
  const { userBarProps, messageBoxProps } = useOutletContext<{
    userBarProps: Props;
    messageBoxProps: Props;
  }>();
  const [banned, setBanned] = useState<boolean>(false);

  useEffect(() => {
    // get banned users
    const fetchBannedUsers = async () => {
      const res = await axiosPrivate.get(getBannedUsersURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          if (res.data.data.includes(user)) {
            setBanned(true);
          }
        } else {
          setBanned(false);
        }
      }
    };
    if (messageBoxProps.currentCourse) {
      fetchBannedUsers();
    }
  }, [messageBoxProps.currentCourse]);

  // when the current course changes, we want to update the messages
  useEffect(() => {
    if (messageBoxProps.currentCourse) {
      assignMessages(messageBoxProps.currentCourse.rooms[0]);
    }
  }, [messageBoxProps.currentCourse]);

  // when the current room changes, we want to update the messages
  useEffect(() => {
    if (messageBoxProps.currentRoom) {
      assignMessages(messageBoxProps.currentRoom);
    }
  }, [messageBoxProps.currentRoom]);

  const assignMessages = (room: Room) => {
    //find room in userCourses since currentRoom messages are not updated
    let foundRoom: Room;
    messageBoxProps.userCourses?.forEach((course) => {
      course.rooms.forEach((room) => {
        if (room.name === messageBoxProps.currentRoom?.name) {
          foundRoom = room;
        }
      });
    });

    const newMessages = foundRoom?.messages.map((message) => {
      const newMessage = {
        username: message.username,
        message: message.message,
        timeSent: message.timeSent,
      };
      return newMessage;
    });
    setMessages(newMessages);
  };

  return (
    <Box sx={{ height: "100%" }}>
      {banned && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <BanDialog />
        </Box>
      )}
      {!banned && (
        <Box sx={{ height: "100%" }} id="test2">
          <Box
            sx={{
              p: 4,
              width: `calc(100% - ${userBarProps.drawerWidth * 2}px)`,
              height: "80%",
              overflowY: "auto",
            }}
            className="scrollBar"
          >
            {messages?.length > 0 ? (
              <Box>
                <Typography variant="h4">Messages</Typography>
                <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                  {messages
                    .slice(0)
                    .reverse()
                    .map((message, index) => (
                      <Box key={index}>
                        <Typography variant="h6">{`[${message.username}]: `}</Typography>
                        <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                          {message.message}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">No messages yet!</Typography>
            )}
          </Box>
          {/* <Box id="userbar"> */}
          <UserBar {...userBarProps} />
          {/* </Box> */}
          <Box
            sx={{
              height: `${userBarProps.appBarHeight}px`,
              position: "absolute",
              bottom: 20,
              right: `${userBarProps.drawerWidth - userBarProps.innerDrawerWidth + 3 * 8}px`,
              left: `${userBarProps.drawerWidth}px`,
            }}
          >
            <MessageBox {...messageBoxProps} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDisplay;
