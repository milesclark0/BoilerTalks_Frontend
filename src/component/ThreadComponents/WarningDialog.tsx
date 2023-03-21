// This file is used to display the warning to the user
import React, { useState } from "react";
import { Button, Box, CardContent, Typography, CardActions, TextField } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { axiosPrivate } from "../../API/axios";
import { updateWarnListURL } from "../../API/CourseManagementAPI";
import { useParams } from "react-router-dom";

type Props = {
  setWarned: React.Dispatch<React.SetStateAction<boolean>>;
  warnedData: { username: string; reason: string };
};

const WarningDialog = ({ setWarned, warnedData }: Props) => {
  const {courseId} = useParams();

  const handleCloseWarning = () => {
    updateWarningListForCourse();
  };

  const updateWarningListForCourse = async () => {
    try {
      const res = await axiosPrivate.post(updateWarnListURL + courseId, {
        username: warnedData.username,
        reason: warnedData.reason
      });
      console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setWarned(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
      <CardContent
        sx={{ display: "flex", justifyContent: "center", overflowY: "auto", width: "80%" }}
      >
        <TextField
          fullWidth
          multiline
          label="Reason for Warning"
          value={warnedData?.reason}
          maxRows={6}
          InputProps={{
            readOnly: true,
          }}
          variant="standard"
        />
        {/* <Typography variant="h6" sx={{ textAlign: "center", wordBreak: "break-word" }}>
          Reason for warning: {warnedData.reason}
        </Typography> */}
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
