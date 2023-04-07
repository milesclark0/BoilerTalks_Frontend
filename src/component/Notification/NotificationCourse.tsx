import React, { useEffect, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";

const NotificationCourse = ({ course, profileData }) => {
  const [messageNoti, setMessageNoti] = useState<boolean>(false);
  const [appealNoti, setAppealNoti] = useState<boolean>(false);
  const [reportNoti, setReportNoti] = useState<boolean>(false);

  useEffect(() => {
    setMessageNoti(course.messages);
    setAppealNoti(course.appeals);
    setReportNoti(course.reports);
  }, [course]);

  const handleMessageSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageNoti(event.target.checked);
  };

  const handleAppealSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppealNoti(event.target.checked);
  };

  const handleReportSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReportNoti(event.target.checked);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {course.courseName}
      </Typography>
      <Typography>
        Messages
        <Switch checked={messageNoti} onChange={handleMessageSwitch} color="warning" />
      </Typography>
      {/* <Typography>
        Get notifications about new messages when you're not online. You can turn these off.
      </Typography> */}
      {profileData?.modThreads.includes(course.courseName) && (
        <Box>
          <Typography>
            Appeals
            <Switch checked={appealNoti} onChange={handleAppealSwitch} color="warning" />
          </Typography>
          {/* <Typography>
            Special notification setting for mods. Get notifications about new appeals when you're
            not online.
          </Typography> */}
          <Typography>
            Reports
            <Switch checked={reportNoti} onChange={handleReportSwitch} color="warning" />
          </Typography>
          {/* <Typography>
            Special notification setting for mods. Get notifications about new reports when you're
            not online.
          </Typography> */}
        </Box>
      )}
    </Box>
  );
};

export default NotificationCourse;
