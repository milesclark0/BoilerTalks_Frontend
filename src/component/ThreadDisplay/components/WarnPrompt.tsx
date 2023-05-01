// This file is used to give a warning to a user
import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "globals/mui";
import { LoadingButton } from "@mui/lab";
import { warnUserURL } from "API/CourseManagementAPI";
import { axiosPrivate } from "API/axios";
import { useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  openWarningPrompt: boolean;
  setOpenWarningPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
};

const WarnPrompt = ({ openWarningPrompt, setOpenWarningPrompt, username }: Props) => {
  const [reasonError, setReasonError] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const { courseId } = useParams();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [sentWarning, setSentWarning] = useState<boolean>(false);

  const handleCloseWarningPrompt = () => {
    setOpenWarningPrompt(false);
  };

  const sendWarningToUser = async () => {
    try {
      const res = await axiosPrivate.post(warnUserURL + courseId, {
        username: username,
        reason: reason,
      });
      console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setSendLoading(false);
          setSentWarning(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendWarning = () => {
    setSendLoading(true);
    if (reason === "") {
      setReasonError(true);
      setSendLoading(false);
      return;
    }
    sendWarningToUser();
  };

  return (
    <Dialog open={openWarningPrompt}>
      {!sentWarning ? (
        <Box>
          <DialogTitle>Warn &quot;{username}&quot;</DialogTitle>
          <DialogContent>
            <Typography>Please provide a reason for warning "{username}".</Typography>
            <TextField
              autoFocus
              multiline
              rows={5}
              margin="dense"
              label="Reason for Warning"
              fullWidth
              required
              onChange={(e) => {
                setReason(e.target.value);
              }}
              error={reasonError}
              inputProps={{ maxLength: 250 }}
              helperText={reasonError ? "Please enter a reason." : ""}
              sx={{ mt: 2, width: 400 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWarningPrompt}>Cancel</Button>
            <LoadingButton onClick={sendWarning} loading={sendLoading} variant="outlined" endIcon={<SendIcon />} loadingPosition="end">
              Send
            </LoadingButton>
          </DialogActions>
        </Box>
      ) : (
        <Box>
          <DialogTitle>Warn Processed</DialogTitle>
          <DialogContent>
            <Typography>You have warned "{username}".</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseWarningPrompt} startIcon={<CloseIcon />} variant="outlined">
              Exit
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default WarnPrompt;
