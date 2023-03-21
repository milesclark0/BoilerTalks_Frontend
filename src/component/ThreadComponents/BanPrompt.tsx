// This file is used to give a ban to a user
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { banUserURL } from "../../API/CourseManagementAPI";
import { axiosPrivate } from "../../API/axios";
import { useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  openBanPrompt: boolean;
  setOpenBanPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
};

const BanPrompt = ({ openBanPrompt, setOpenBanPrompt, username }: Props) => {
  const [reasonError, setReasonError] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const { courseId } = useParams();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [sentBan, setSentBan] = useState<boolean>(false);

  const handleCloseBanPrompt = () => {
    setOpenBanPrompt(false);
  };

  const sendBanToUser = async () => {
    try {
      const res = await axiosPrivate.post(banUserURL + courseId, {
        username: username,
        reason: reason,
      });
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setSentBan(true);
          setSendLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendBan = () => {
    setSendLoading(true);
    if (reason === "") {
      setReasonError(true);
      setSendLoading(false);
      return;
    }
    sendBanToUser();
  };

  return (
    <Dialog open={openBanPrompt}>
      {!sentBan ? (
        <Box>
          <DialogTitle>Ban &quot;{username}&quot;</DialogTitle>
          <DialogContent>
            <DialogContentText>Please provide a reason for banning "{username}".</DialogContentText>
            <TextField
              autoFocus
              multiline
              margin="dense"
              label="Reason for ban"
              fullWidth
              rows={5}
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
            <Button onClick={handleCloseBanPrompt}>Cancel</Button>
            <LoadingButton
              onClick={sendBan}
              variant="outlined"
              loading={sendLoading}
              endIcon={<SendIcon />}
              loadingPosition="end"
            >
              Send
            </LoadingButton>
          </DialogActions>
        </Box>
      ) : (
        <Box>
          <DialogTitle>Ban Processed</DialogTitle>
          <DialogContent>
            <DialogContentText>You have banned "{username}".</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBanPrompt} startIcon={<CloseIcon />} variant="outlined">
              Exit
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default BanPrompt;
