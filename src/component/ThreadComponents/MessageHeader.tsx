import { Box, Typography, Grid, IconButton, Tooltip } from "@mui/material";
import { Message } from "../../globals/types";
import ReplyIcon from "@mui/icons-material/Reply";
import BlockIcon from "@mui/icons-material/Block";
import TrashIcon from "@mui/icons-material/Delete";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import BlockUserModal from "../HomePage/components/blockUserModal";
import { useState } from "react";
import { useAuth } from "../../context/context";
import GavelIcon from "@mui/icons-material/Gavel";
import useSocketFunctions from "../../hooks/useSocketFunctions";
import useStore from "../../store/store";

type MessageHeaderProps = {
  hoveredMessageId: number;
  message: Message;
  index: number;
  isReply: (newValue: boolean) => void;
  isRoomMod: boolean;
  promoteUser: (username: string) => void;
  isReacting: () => void;
  setReactingIndex: (newValue: number) => void;
};

const getTime = (timeSent: string, isHovered: boolean) => {
  const options = !isHovered
    ? ({ hour: "numeric", minute: "numeric" } as const)
    : ({
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      } as const);
  const date = new Date(timeSent);
  return !isHovered ? date.toLocaleTimeString("en-US", options) : date.toLocaleDateString("en-US", options);
};

export const MessageHeader = ({
  hoveredMessageId,
  message,
  index,
  isReply,
  isRoomMod,
  promoteUser,
  isReacting,
  setReactingIndex,
}: MessageHeaderProps) => {
  const { user } = useAuth();
  const [userToBlock, setUserToBlock] = useState<string>("");
  const [showBlockUser, setShowBlockUser] = useState<boolean>(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState<boolean>(false);
  const {deleteMessage} = useSocketFunctions()
  const currentRoom = useStore((state) => state.currentRoom);
  

  const blockUserProps = {
    requestUsername: user.username,
    userToBlock,
    showBlockUser,
    setShowBlockUser,
  };

  function handleDeleteMessage() {
    deleteMessage(message, currentRoom);
    //show confirmation message

  }

  return (
    <div style={{ height: "100%", alignItems: "top", display: "flex" }}>
      <div style={{ display: "inline" }}>
        <Typography variant="h6" display="inline">{`${message.displayName || message.username}`}</Typography>
        <Tooltip title={getTime(message.timeSent, true)} placement="top" arrow>
          <Typography variant="overline" sx={{ paddingLeft: "5px" }}>
            {getTime(message.timeSent, false)}
          </Typography>
        </Tooltip>
      </div>
      {hoveredMessageId === index ? (
        <div
        style={{
          display: "inline",
        }}
        >
        <BlockUserModal {...blockUserProps} />
          <Grid
            container
            sx={{
              display: "inline",
            }}
          >
            <Grid
              item
              xs={6}
              sx={{
                display: "inline",
                marginRight: "-5px",
              }}
            >
              <Tooltip title="React" placement="top" arrow>
                <IconButton
                  onClick={() => {
                    isReacting();
                    setReactingIndex(index);
                  }}
                  size="small"
                >
                  <AddReactionIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6} sx={{ display: "inline" }}>
              <Tooltip title="Reply" placement="top" arrow>
                <IconButton
                  onClick={() => {
                    isReply(true);
                  }}
                  size="small"
                >
                  <ReplyIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            {user?.username != message.username && (
              <Grid item xs={6} sx={{ display: "inline" }}>
                <Tooltip title="Block" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      setUserToBlock(message.username);
                      setShowBlockUser(true);
                    }}
                    size="small"
                  >
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
            {isRoomMod ? (
              <Grid item xs={6} sx={{ display: "inline" }}>
                <Tooltip title="Promote To Moderator" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      promoteUser(message.displayName || message.username);
                    }}
                    size="small"
                  >
                    <GavelIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ) : null}
            {message.username === user?.username ? (
              <Grid item xs={6} sx={{ display: "inline" }}>
                <Tooltip title="Delete Message" placement="top" arrow>
                  <IconButton
                    onClick={handleDeleteMessage}
                    size="small"
                  >
                    <TrashIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            ) : null}
          </Grid>
        </div>
      ) : null}
    </div>
  );
};
