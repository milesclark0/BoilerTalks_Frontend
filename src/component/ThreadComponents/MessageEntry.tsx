import { Avatar, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Message, Room } from "../../types/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";
import { EmojiPanel } from "../HomePage/emojiPanel";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";
import { Course } from "../../types/types";
import UserMenu from "./UserMenu";

type MessageEntryProps = {
  message: Message;
  messages: Message[];
  index: number;
  isReply: (newValue: boolean) => void;
  isRoomMod: boolean;
  promoteUser: (username: string) => void;
  room: Room;
  addReaction: (
    message: Message,
    room: Room,
    isSystemMessage: boolean,
    reaction: string,
    index: number
  ) => void;
  course: Course | null;
};

export const MessageEntry = ({
  message,
  messages,
  index,
  isReply,
  isRoomMod,
  promoteUser,
  room,
  addReaction,
  course,
}: MessageEntryProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number>(null);
  const [emojiPanelShow, setEmojiPanelShow] = useState<boolean>(false);

  function handleEmojiPanelChange() {
    setEmojiPanelShow(!emojiPanelShow);
  }

  const [reactingIndex, setReactingIndex] = useState<number>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const GetProfilePicture = (message: Message) => {
    // if (message.profilePic) {
    //   return (
    //     <IconButton onClick={handleUserClick}>
    //       <Avatar
    //         sx={{ width: 35, height: 35, mr: 2 }}
    //         src={message.profilePic + `?${Date.now()}`}
    //       />
    //     </IconButton>
    //   );
    // } else {
    //   //returns default profile picture if not set
    //   return (
    //     <IconButton onClick={handleUserClick}>
    //       <Avatar sx={{ width: 35, height: 35, mr: 2 }} />
    //     </IconButton>
    //   );
    // }
    return (
      <IconButton onClick={handleUserClick} sx={{ width: 35, height: 35, mr: 3 }}>
        <Avatar src={message.profilePic + `?${Date.now()}`} />
      </IconButton>
    );
  };

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
          backgroundColor: "lightgrey",
        },
      }}
      onMouseEnter={() => {
        setHoveredMessageId(index);
      }}
      onMouseLeave={() => setHoveredMessageId(null)}
    >
      {/* ----MESSAGE THREAD UI */}
      <Box sx={{ display: "flex", alignItems: "center" }}>{GetProfilePicture(message)}</Box>
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
              {`Replied To: ` +
                messages[message.replyIndex].username +
                `: ` +
                messages[message.replyIndex].message}
            </Typography>
          </Box>
        ) : null}
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

        {message.reactions?.map((reaction, index) => {
          return (
            <React.Fragment key={index}>
              <Emoji unified={reaction.reaction} emojiStyle={EmojiStyle.APPLE} size={22} />
            </React.Fragment>
          );
        })}
        {reactingIndex === index && emojiPanelShow ? (
          <EmojiPanel message={message} room={room} index={index} addReaction={addReaction} />
        ) : null}
      </Box>
      <UserMenu
        username={message.username}
        course={course}
        openUserMenu={openUserMenu}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </Box>
  );
};
