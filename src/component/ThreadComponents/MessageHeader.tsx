import { Box, Typography, Grid, Tooltip, IconButton } from "@mui/material";
import { Message } from "../../types/types";
import ReplyIcon from "@mui/icons-material/Reply";
import AddReactionIcon from "@mui/icons-material/AddReaction";

type MessageHeaderProps = {
  hoveredMessageId: number;
  message: Message;
  index: number;
};
const armyToRegTime = (time: any) => {
  const clock = time.split(" ");
  const [hours, minutes, seconds] = clock[1].split(":").map(Number);
  let timeValue = hours > 0 && hours <= 12 ? "" + hours : hours > 12 ? "" + (hours - 12) : "12";
  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " P.M." : " A.M.";
  return timeValue;
};

export const MessageHeader = ({ hoveredMessageId, message, index }: MessageHeaderProps) => {
  return (
    <Box>
      <Typography variant="h6" display="inline">{`${message.username} `}</Typography>
      <Typography variant="overline" display="inline" sx={{ color: "black", paddingLeft: "5px" }}>
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
              <IconButton>
                <ReplyIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
