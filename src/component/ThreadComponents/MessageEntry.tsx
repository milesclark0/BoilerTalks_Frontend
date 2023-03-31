import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/context";
import { Message, Room } from "../../types/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";
import { EmojiPanel } from "../HomePage/emojiPanel";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";

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
}: MessageEntryProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number>(null);
  const [emojiPanelShow, setEmojiPanelShow] = useState<boolean>(false);
  const [reactingIndex, setReactingIndex] = useState<number>(null);
  const GetProfilePicture = (message) => {
    if (message.profilePic) {
      return (
        <Avatar
          sx={{ width: 35, height: 35, mr: 2 }}
          src={message.profilePic + `?${Date.now()}`}
        />
      );
    } else {
      //returns default profile picture if not set
      return <Avatar sx={{ width: 35, height: 35, mr: 2 }} />;
    }
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

      {GetProfilePicture(message)}
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
          isReacting={setEmojiPanelShow}
          setReactingIndex={setReactingIndex}
        />
        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
          {message.message}
        </Typography>

        {message.reactions?.map((reaction, index) => {
          return (
            <React.Fragment key={index}>
              <Emoji
                unified={reaction.reaction}
                emojiStyle={EmojiStyle.APPLE}
                size={22}
              />
            </React.Fragment>
          );
        })}
        {reactingIndex === index && emojiPanelShow ? (
          <EmojiPanel
            message={message}
            room={room}
            index={index}
            addReaction={addReaction}
          />
        ) : null}
      </Box>
    </Box>
  );
};
