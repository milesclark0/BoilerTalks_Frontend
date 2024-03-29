import { Avatar, Box, Typography, IconButton, Tooltip } from "globals/mui";
import { useCallback, useState } from "react";
import { Message, Course } from "globals/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";
import { EmojiPanel } from "./emojiPanel";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "context/context";

type MessageEntryProps = {
  message: Message;
  messages: Message[];
  index: number;
  isReply: (newValue: boolean) => void;
  isRoomMod: boolean;
  isEdit: (newValue: boolean) => void;
  promoteUser: (username: string) => void;
  addReaction: (reaction: string, index: number) => void;
  course: Course | null;
};

const MessageEntry = ({ message, messages, index, isReply, isRoomMod, isEdit, promoteUser, addReaction, course }: MessageEntryProps) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<number>(null);
  const [emojiPanelShow, setEmojiPanelShow] = useState<boolean>(false);

  function handleEmojiPanelChange() {
    setEmojiPanelShow(!emojiPanelShow);
  }

  const [reactingIndex, setReactingIndex] = useState<number>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);
  const { themeSetting } = useAuth();

  const handleUserClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleHoverEnter = useCallback(() => {
    setHoveredMessageId(index);
  }, [index]);

  const handleHoverLeave = useCallback(() => {
    setHoveredMessageId(null);
  }, []);

  const replyIndex = messages.findIndex((m) => m.timeSent === message.replyId?.id && m.username === message.replyId?.username);
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
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
    >
      {/* ----MESSAGE THREAD UI */}

      <GetProfilePicture src={message.profilePic} handleUserClick={handleUserClick} />
      <Box
        sx={{
          overflow: "hidden",
          borderColor: "black",
        }}
      >
        {message.replyId ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <MessageIcon sx={{ paddingRight: "9px", color: "grey" }} />
            <Typography sx={{ fontSize: "12px" }}>
              {messages[replyIndex] ? `Replied To: ` + messages[replyIndex].username + `: ` + messages[replyIndex].message : "Message Deleted"}
            </Typography>
          </div>
        ) : null}
        <div>
          <MessageHeader
            message={message}
            index={index}
            hoveredMessageId={hoveredMessageId}
            isReply={isReply}
            isRoomMod={isRoomMod}
            isEdit={isEdit}
            promoteUser={promoteUser}
            isReacting={handleEmojiPanelChange}
            setReactingIndex={setReactingIndex}
          />
          <Typography style={{ wordWrap: "break-word", paddingBottom: "5px" }}>{message.message}</Typography>
        </div>

        {message.reactions?.map((reaction, index) => {
          return (
            <React.Fragment key={index}>
              {reaction.reaction && (
                <Tooltip title={`${reaction.displayName || reaction.username}'s reaction`} placement="bottom" arrow>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "5px",
                      width: "30px",
                      height: "30px",
                      ":hover": {
                        backgroundColor: themeSetting === "dark" ? "#222222" : "#d3d3d3",
                      },
                      border: "0.5px ridge grey",
                      borderRadius: "20%",
                      textAlign: "center",
                    }}
                  >
                    <Emoji unified={reaction.reaction} emojiStyle={EmojiStyle.APPLE} size={20} />
                  </Box>
                </Tooltip>
              )}
            </React.Fragment>
          );
        })}

        {reactingIndex === index && emojiPanelShow ? <EmojiPanel message={message} index={index} addReaction={addReaction} /> : null}
      </Box>
      <UserMenu username={message.username} course={course} openUserMenu={openUserMenu} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </Box>
  );
};
const GetProfilePicture = ({ src, handleUserClick }) => {
  // only show profile picture if it is the first message or if the username is different from the previous message
  // const show = index === 0 || messages[index].username !== messages[index - 1].username;
  // const visibility = show ? "visible" : "hidden";
  return (
    <IconButton onClick={handleUserClick} sx={{ width: 35, height: 35, mr: 3, visibility: "visible" }}>
      <Avatar src={src} />
    </IconButton>
  );
};
export default React.memo(MessageEntry);
