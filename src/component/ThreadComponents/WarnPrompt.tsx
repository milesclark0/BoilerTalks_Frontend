// This file is used to give a warning to a user
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { warnUserURL } from "../../API/CourseManagementAPI";
import { axiosPrivate } from "../../API/axios";
import { useParams } from "react-router-dom";

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

  const handleCloseWarningPrompt = () => {
    setOpenWarningPrompt(false);
  };

  const sendWarningToUser = async () => {
    try {
      const res = await axiosPrivate.post(warnUserURL + courseId, {
        user: username,
        reason: reason,
      });
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
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
    // sendWarningToUser();
    setSendLoading(false);
  };

  return (
    <Dialog open={openWarningPrompt} onClose={handleCloseWarningPrompt}>
      <DialogTitle>Warn {username}</DialogTitle>
      <DialogContent>
        <DialogContentText>Please provide a reason for warning {username}.</DialogContentText>
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
        <LoadingButton
          onClick={sendWarning}
          loading={sendLoading}
          disabled={sendLoading}
          variant="outlined"
        >
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WarnPrompt;
