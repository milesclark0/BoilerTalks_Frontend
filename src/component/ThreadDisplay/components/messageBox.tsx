import React, { useEffect, useState } from "react";
import { Box, Button } from "globals/mui";
import { TextField, InputAdornment, IconButton } from "globals/mui";
import useSocketFunctions from "hooks/useSocketFunctions";
import { Course, Message, Room } from "globals/types";
import { useAuth } from "context/context";
import SendIcon from "@mui/icons-material/Send";
import useStore from "store/store";
import PollIcon from "@mui/icons-material/Poll";
import { Tooltip } from "globals/mui";

type Props = {
  toggleShowPollBox: () => void;
  updateReaction: (reaction: string, index: number) => void;
  replyId: { username: string; id: string };
  handleReply: (index: number, isReplying: any) => void;
  editId: number;
  isEditing: boolean;
  handleEdit: (index: number, isEditing: any) => void;
  reaction: { reaction: string; index: number };
  messages: Message[];
};

const MessageBox = ({ updateReaction, replyId, handleReply, editId, isEditing, handleEdit, reaction, messages, toggleShowPollBox }: Props) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>("");
  const { sendMessage, editMessage, connectToRoom, addReaction } = useSocketFunctions();

  const [currentRoom, updateRoomMessages, updateCurrentRoom, socket] = useStore((state) => [
    state.currentRoom,
    state.updateRoomMessages,
    state.updateCurrentRoom,
    state.socket,
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
      replyId: messages[messages.length - 1]?.replyId, //set the reply index to the reply index of the last message
      reactions: messages[messages.length - 1]?.reactions, //set the reactions to the reactions of the last message
      edited: false,
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

  const handleSendMessage = async () => {
    const formattedMessage = {
      username: user?.username,
      message,
      timeSent: `${getDateTime()}`,
      profilePic: user?.profilePicture,
      replyId,
      edited: false,
    };
    await sendMessage(formattedMessage, currentRoom, false);
    handleReply(null, false);
    setMessage("");
  };

  const handleEditMessage = async () => {
    const formattedMessage = {
      username: user?.username,
      message,
      timeSent: messages[editId].timeSent,
      profilePic: user?.profilePicture,
      edited: true,
    };
    await editMessage(formattedMessage, currentRoom, editId);
    handleEdit(null, false);
    setMessage("");
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isEditing) {
        handleEditMessage();
      } else {
        handleSendMessage();
      }
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
        disabled={!socket?.connected}
        sx={{
          width: "100%",
        }}
        onChange={handleMessageChange}
        onKeyDown={handleEnterKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={isEditing ? handleEditMessage : handleSendMessage}>
                <SendIcon />
              </IconButton>
              <Tooltip title={"Add Poll"} placement="top" arrow>
                <IconButton onClick={toggleShowPollBox}>
                  <PollIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default React.memo(MessageBox);
