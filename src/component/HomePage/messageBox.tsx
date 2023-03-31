import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import useSockets from "../../hooks/useSockets";
import { Course, Message, Room } from "../../types/types";
import { useAuth } from "../../context/context";
import SendIcon from "@mui/icons-material/Send";

type Props = {
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  connectToRoom: (room: Room) => Promise<void>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (
    message: { username: string; message: string; timeSent: string, profilePic: string, replyIndex?: number, reactions?: any[] },
    room: Room,
    isSystemMessage: boolean
  ) => void;
  replyIndex: any;
  handleReply: (index: number, isReplying: any) => void;
};

const MessageBox = ({
  currentCourse,
  setCurrentCourse,
  userCourses,
  setUserCourses,
  currentRoom,
  setCurrentRoom,
  connectToRoom,
  messages,
  setMessages,
  sendMessage,
  replyIndex,
  handleReply,
}: Props) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    //when the current room changes, connect to the room and set the messages to the messages in the room
    const connect = async (room: Room) => {
      if (room) {
        console.log("connecting to room", room?.name);
        await connectToRoom(room);
      }
    };
    connect(currentRoom);
  }, [currentRoom]);

  useEffect(() => {
    //on message received, update the messages and scroll to the bottom of the message box
    if (message !== "") {
      updateMessageFields(message);
      setMessage("");
    }
  }, [messages]);

  // get the current date and time in the format of YYYY-MM-DD HH:MM:SS
  const getDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const updateMessageFields = (message: any) => {
    console.log("updating message fields");
    const formattedMessage = {
      username: user?.username,
      message,
      timeSent: `${getDateTime()}`,
      profilePic: user?.profilePicture,
      replyIndex: messages[messages.length - 1]?.replyIndex //set the reply index to the reply index of the last message
    };
    //update message fields in userCourses and currentCourse and currentRoom
    const userCourseCopy = structuredClone(userCourses);
    userCourseCopy?.forEach((course) => {
      if (course._id.$oid === currentCourse?._id.$oid) {
        //find the room in the course
        course.rooms.forEach((room) => {
          if (room._id.$oid === currentRoom?._id.$oid) {
            room.messages.push(formattedMessage);
          }
        });

        if (currentRoom?._id.$oid === course?.modRoom._id.$oid){
          course?.modRoom.messages.push(formattedMessage); 
        }
      }
    });
    setUserCourses(userCourseCopy);

    //update current course
    const currCourseCopy = structuredClone(currentCourse);
    currCourseCopy?.rooms.forEach((room) => {
      if (room._id.$oid === currentRoom?._id.$oid) {
        room.messages.push(formattedMessage);
      }
    });

    if (currentRoom?._id.$oid === currCourseCopy?.modRoom._id.$oid){
      currCourseCopy?.modRoom.messages.push(formattedMessage);
    }
    setCurrentCourse(currCourseCopy);
  };

  const handleSendMessage = () => {
    const formattedMessage = {
      username: user?.username,
      message,
      timeSent: `${getDateTime()}`,
      profilePic: user?.profilePicture,
      replyIndex,
    };
    sendMessage(formattedMessage, currentRoom, false);
    handleReply(null, false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Box
      display={"flex"}
      sx={{
        pl: 2,
        pr: 2,
      }}
    >
      <TextField
        label="Enter Message"
        value={message}
        sx={{
          width: "100%",
        }}
        onChange={handleMessageChange}
        onKeyDown={handleEnterKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* <Button onClick={handleSendMessage}>Send</Button> */}
    </Box>
  );
};

export default MessageBox;
