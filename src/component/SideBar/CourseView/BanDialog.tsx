import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import DangerousIcon from "@mui/icons-material/Dangerous";

const BanDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [submittedAppeal, setSubmittedAppeal] = useState<boolean>(false);

  const AppealProps = {
    setSubmittedAppeal
  };

  const handleClose = () => {
    setOpen(false);
  };

  const AppealForm = ({ ...AppealProps }) => {
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [descriptionError, setDescriptionError] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");

    const submitAppeal = () => {
      if (description.length === 0) {
        setDescriptionError(true);
        return;
      }
      AppealProps.setSubmittedAppeal(true);
      setOpenForm(false);
    };

    const openAppealForm = () => {
      setOpenForm(true);
    };

    const closeAppealForm = () => {
      setOpenForm(false);
    };

    return (
      <React.Fragment>
        <Button onClick={openAppealForm} variant="outlined">
          Open Appeal Form
        </Button>
        <Dialog open={openForm}>
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>{"Appeal your ban"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* get username and get reason for ban */}
              Please provide a reason for why you should be unbanned.
            </DialogContentText>
            <TextField
              id="reason"
              label="Reason"
              multiline
              rows={5}
              autoFocus
              fullWidth
              required
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              error={descriptionError}
              inputProps={{ maxLength: 250 }}
              helperText={descriptionError ? "Please enter a reason." : ""}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAppealForm} variant="outlined">
              Cancel
            </Button>
            <Button onClick={submitAppeal} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <DangerousIcon sx={{ color: "red", mr: 2 }} />
        {"You have been banned!"}
      </DialogTitle>
      {submittedAppeal ? (
        <>
          <DialogContent>
            <DialogContentText>
              {/* get username and get reason for ban */}
              Your appeal is under review. You will be notified of the decision once it has been processed.
            </DialogContentText>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogContent>
            <DialogContentText>
              {/* get username and get reason for ban */}
              Very naughty!
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <AppealForm {...AppealProps} />
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default BanDialog;
