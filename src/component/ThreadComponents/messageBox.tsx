import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import useSocketFunctions from "../../hooks/useSocketFunctions";
import { Course, Message, Room } from "../../globals/types";
import { useAuth } from "../../context/context";
import SendIcon from "@mui/icons-material/Send";
import useStore from "../../store/store";

type Props = {
  updateReaction: ( reaction: string,index: number) => void;
  replyIndex: any;
  handleReply: (index: number, isReplying: any) => void;
  reaction: { reaction: string; index: number };
  messages: Message[];
};

const MessageBox = ({ updateReaction, replyIndex, handleReply, reaction, messages }: Props) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const {sendMessage, connectToRoom, addReaction} = useSocketFunctions();

  const [currentRoom, updateRoomMessages, updateCurrentRoom, isConnected] = useStore((state) => [
    state.currentRoom,
    state.updateRoomMessages,
    state.updateCurrentRoom,
    state.isConnected,
  ]);

  //listen to reaction change and send the reaction to the server
  useEffect(() => {
    if (reaction != null) {
      addReaction(messages[reaction.index], currentRoom, false, reaction.reaction, reaction.index);
      updateReaction(null, null);
    }
  }, [reaction]);

  useEffect(() => {
    //when the current room changes, connect to the room and set the messages to the messages in the room
    console.log("connecting to room")
    const connect = async (room: Room) => {
      if (room) {
        await connectToRoom(room);
      }
    };
    connect(currentRoom);
  }, [currentRoom]);


  // get the current date and time in the format of YYYY-MM-DD HH:MM:SS
  const getDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}:${millisecond}`;
  };

  const updateMessageFields = (message: any) => {
    console.log("updating message fields");
    const formattedMessage = {
      username: user?.username,
      message,
      timeSent: `${getDateTime()}`,
      profilePic: user?.profilePicture,
      replyIndex: messages[messages.length - 1]?.replyIndex, //set the reply index to the reply index of the last message
      reactions: messages[messages.length - 1]?.reactions, //set the reactions to the reactions of the last message
    };
    //update message fields in currentRoom and roomList
    if (currentRoom) {
      updateCurrentRoom(formattedMessage);
      updateRoomMessages(currentRoom, formattedMessage);
    }
    // if (currentRoom?._id.$oid === currentCourse?.modRoom._id.$oid) {
    //   currCourseCopy?.modRoom.messages.push(formattedMessage);
    // }
    // setCurrentCourse(currCourseCopy);
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
    setMessage("");
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return(
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
        disabled={!isConnected}
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
    </Box>
  );
};

export default React.memo(MessageBox);
