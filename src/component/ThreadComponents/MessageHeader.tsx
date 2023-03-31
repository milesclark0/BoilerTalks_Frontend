import { Box, Typography, Grid, Tooltip, IconButton } from "@mui/material";
import { Message } from "../../types/types";
import ReplyIcon from "@mui/icons-material/Reply";
import BlockIcon from "@mui/icons-material/Block";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import BlockUserModal from "../HomePage/blockUserModal";
import { useState } from "react";
import { useAuth } from "../../context/context";
import GavelIcon from "@mui/icons-material/Gavel";

type MessageHeaderProps = {
  hoveredMessageId: number;
  message: Message;
  index: number;
  isReply: (newValue: boolean) => void;
  isRoomMod: boolean;
  promoteUser: (username: string) => void;
};
const armyToRegTime = (time: any) => {
  const clock = time.split(" ");
  const [hours, minutes, seconds] = clock[1].split(":").map(Number);
  let timeValue =
    hours > 0 && hours <= 12
      ? "" + hours
      : hours > 12
      ? "" + (hours - 12)
      : "12";
  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " P.M." : " A.M.";
  return timeValue;
};

export const MessageHeader = ({
  hoveredMessageId,
  message,
  index,
  isReply,
  isRoomMod,
  promoteUser,
}: MessageHeaderProps) => {
  const { user } = useAuth();
  const [userToBlock, setUserToBlock] = useState<string>("");
  const [showBlockUser, setShowBlockUser] = useState<boolean>(false);

  const blockUserProps = {
    requestUsername: user.username,
    userToBlock,
    showBlockUser,
    setShowBlockUser,
  };

  return (
    <Box>
      <BlockUserModal {...blockUserProps} />
      <Typography
        variant="h6"
        display="inline"
      >{`${message.username} `}</Typography>
      <Typography
        variant="overline"
        display="inline"
        sx={{ color: "black", paddingLeft: "5px" }}
      >
        {armyToRegTime(message.timeSent)}
      </Typography>
      <Box
        sx={{
          display: "inline",
          visibility: hoveredMessageId === index ? "visible" : "hidden",
        }}
      >
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
            <Tooltip title="React" placement="bottom-start">
              <IconButton>
                <AddReactionIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={6} sx={{ display: "inline" }}>
            <Tooltip title="Reply" placement="bottom-start">
              <IconButton
                onClick={() => {
                  isReply(true);
                }}
              >
                <ReplyIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          {user?.username != message.username && (
            <Grid item xs={6} sx={{ display: "inline" }}>
              <IconButton>
                <BlockIcon
                  onClick={() => {
                    setUserToBlock(message.username);
                    setShowBlockUser(true);
                  }}
                />
              </IconButton>
            </Grid>
          )}
          {isRoomMod ? (
            <Grid item xs={6} sx={{ display: "inline" }}>
              <Tooltip title="Promote To Moderator" placement="bottom-start">
                <IconButton
                  onClick={() => {
                    promoteUser(message.username);
                  }}
                >
                  <GavelIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </Box>
  );
};
