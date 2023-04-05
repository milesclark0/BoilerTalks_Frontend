import React from "react";
import { Box, Switch, Typography } from "@mui/material";

const NotificationCourse = ({ course, profileData }) => {
  return (
    <Box>
      <Typography>{course.courseName}</Typography>
      <Typography>Messages</Typography>
      <Switch checked={false} />
      {profileData?.modThreads.includes(course.courseName) && (
        <Box>
          <Typography>Appeals</Typography>
          <Switch checked={false} />
          <Typography>Reports</Typography>
          <Switch checked={false} />
        </Box>
      )}
    </Box>
  );
};

export default NotificationCourse;
