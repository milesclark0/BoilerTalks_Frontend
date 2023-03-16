import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography, Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room, Message } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/userBar";
import MessageBox from "../HomePage/messageBox";

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
  sendMessage: (message: { username: string; message: string; timeSent: string }, room: Room, isSystemMessage: boolean) => void;
  connectToRoom: (room: Room) => void;
  disconnectFromRoom: (room: Room) => void;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
};

const RoomDisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  // const [showCourses, setShowCourses] = useState(false);
  // const [activeIcon, setActiveIcon] = useState<{
  //   course: string;
  //   isActiveCourse: boolean;
  // }>({ course: "", isActiveCourse: false });
  //this value will hold the actual course data (all semesters included) for each user course
  // const [userCourses, setUserCourses] = useState<Course[]>([]);
  // const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  // const [currentRoom, setCurrentRoom] = useState<Room>(null);
  // const [distinctCoursesByDepartment, setDistinctCoursesByDepartment] = useState<Course[]>([]);
  // const [distinctDepartments, setDistinctDepartments] = useState<string[]>([]); 
  // const [currentSemester, setCurrentSemester] = useState<string>("");
  // const [fetchError, setFetchError] = useState("");
  // const [courseUsers, setCourseUsers] = useState([]);
  // const navigate = useNavigate();
  const { message, setMessage, messages, setMessages, sendMessage, connectToRoom, disconnectFromRoom } = useSockets();
  const { roomId } = useParams();
  const { userBarProps, messageBoxProps } = useOutletContext<{ userBarProps: Props; messageBoxProps: Props }>();

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
    <Box>
      {messages?.length > 0 ? (
        <Box sx={{ overflowY: "auto" }} className="scollBar">
          <Typography variant="h4">Messages</Typography>
          {messages.map((message, index) => (
            <Typography key={index} variant="h6">
              {`[${message.username}]: ${message.message}`}
            </Typography>
          ))}
        </Box>
      ) : (
        <Typography variant="h6">No messages yet!</Typography>
      )}
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
      <UserBar {...userBarProps} />
    </Box>
  );
};

export default RoomDisplay;
