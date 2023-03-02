import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const WarningDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <WarningIcon sx={{ color: "red", mr: 2}} />
        {"You have been warned!"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {/* get username and get reason for warning */}
          Naughty Naughty!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus variant="contained">
          Got it.
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
