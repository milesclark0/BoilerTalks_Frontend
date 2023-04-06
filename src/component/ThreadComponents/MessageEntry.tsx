import { Avatar, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Message, Room } from "../../globals/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";
import { EmojiPanel } from "./emojiPanel";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";
import { Course } from "../../globals/types";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/context";
import { Visibility } from "@mui/icons-material";

type MessageEntryProps = {
  message: Message;
  messages: Message[];
  index: number;
  isReply: (newValue: boolean) => void;
  isRoomMod: boolean;
  promoteUser: (username: string) => void;
  addReaction: (reaction: string, index: number) => void;
  course: Course | null;
  profilePicLastUpdated: number;
};

export const MessageEntry = ({
  message,
  messages,
  index,
  isReply,
  isRoomMod,
  promoteUser,
  addReaction,
  course,
  profilePicLastUpdated,
}: MessageEntryProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number>(null);
  const [emojiPanelShow, setEmojiPanelShow] = useState<boolean>(false);

  function handleEmojiPanelChange() {
    setEmojiPanelShow(!emojiPanelShow);
  }

  const [reactingIndex, setReactingIndex] = useState<number>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);
  const { themeSetting } = useAuth();

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        pl: 1,
        pt: 1,
        width: "100%",
        ":hover": {
          backgroundColor: themeSetting === "dark" ? "#2f2f2f" : "#e0e0e0",
        },
      }}
      onMouseEnter={() => {
        setHoveredMessageId(index);
      }}
      onMouseLeave={() => setHoveredMessageId(null)}
    >
      {/* ----MESSAGE THREAD UI */}

      <GetProfilePicture index={index} messages={messages} handleUserClick={handleUserClick} profilePicLastUpdated={profilePicLastUpdated} />
      <Box
        sx={{
          overflow: "hidden",
          borderColor: "black",
        }}
      >
        {Number.isInteger(message.replyIndex) ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <MessageIcon sx={{ paddingRight: "9px", color: "grey" }} />
            <Typography sx={{ fontSize: "12px" }}>
              {`Replied To: ` + messages[message.replyIndex].username + `: ` + messages[message.replyIndex].message}
            </Typography>
          </Box>
        ) : null}
        <Box>
          <MessageHeader
            message={message}
            index={index}
            hoveredMessageId={hoveredMessageId}
            isReply={isReply}
            isRoomMod={isRoomMod}
            promoteUser={promoteUser}
            isReacting={handleEmojiPanelChange}
            setReactingIndex={setReactingIndex}
          />
          <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
            {message.message}
          </Typography>
        </Box>

        {message.reactions?.map((reaction, index) => {
          return (
            <React.Fragment key={index}>
              <Emoji unified={reaction.reaction} emojiStyle={EmojiStyle.APPLE} size={22} />
            </React.Fragment>
          );
        })}
        {reactingIndex === index && emojiPanelShow ? <EmojiPanel message={message} index={index} addReaction={addReaction} /> : null}
      </Box>
      <UserMenu username={message.username} course={course} openUserMenu={openUserMenu} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </Box>
  );
};
const GetProfilePicture = ({ index, messages, handleUserClick, profilePicLastUpdated }) => {
  // only show profile picture if it is the first message or if the username is different from the previous message
  // const show = index === 0 || messages[index].username !== messages[index - 1].username;
  // const visibility = show ? "visible" : "hidden";
  const message = messages[index];
  return (
    <IconButton onClick={handleUserClick} sx={{ width: 35, height: 35, mr: 3, visibility: "visible" }}>
      <Avatar src={message.profilePic + `?${profilePicLastUpdated}`} />
    </IconButton>
  );
};
