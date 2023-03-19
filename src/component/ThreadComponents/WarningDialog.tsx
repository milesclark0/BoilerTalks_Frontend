// This file is used to display the warning to the user
import React, { useState } from "react";
import {
  Button,
  Box,
  CardContent,
  Typography,
  CardActions
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const WarningDialog = ({ setWarned }) => {
  const handleCloseWarning = () => {
    setWarned(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        boxShadow: 8,
        borderRadius: 2,
        maxHeight: "60%",
        width: "50%",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", mt: 4 }}>
        <WarningIcon sx={{ color: "red", mr: 2, width: 45, height: 45 }} />
        <Typography variant="h4">You have been warned!</Typography>
      </CardContent>
      <CardContent sx={{ display: "flex", justifyContent: "center", overflowY: "auto" }}>
        <Typography variant="h6" sx={{ textAlign: "center", wordBreak: "break-word" }}>
          Naughty Naughty...
        </Typography>
      </CardContent>
      <CardActions sx={{ mb: 2 }}>
        <Button onClick={handleCloseWarning} autoFocus variant="contained">
          Got it.
        </Button>
      </CardActions>
    </Box>
  );
};

export default WarningDialog;
