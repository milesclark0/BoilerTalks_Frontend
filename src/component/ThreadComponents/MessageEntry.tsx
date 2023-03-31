import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/context";
import { Message } from "../../types/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";

type MessageEntryProps = {
  message: Message;
  messages: Message[];
  index: number;
  isReply: (newValue: boolean) => void;
};
export const MessageEntry = ({
  message,
  messages,
  index,
  isReply,
}: MessageEntryProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number>(null);

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
        />
        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
          {message.message}
        </Typography>
      </Box>
    </Box>
  );
};
