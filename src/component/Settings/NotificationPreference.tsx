import React, { useEffect } from "react";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { getProfileURL } from "../../API/ProfileAPI";
import NotificationCourse from "../Notification/NotificationCourse";
import { Profile } from "../../globals/types";
import { LoadingButton } from "@mui/lab";

type NotificationPreference = {
  courseName: string;
  messages: boolean;
  appeals: boolean;
  reports: boolean;
};

const NotificationPreference = () => {
  const [notificationCourses, setNotificationCourses] = useState<NotificationPreference[]>(null);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<Profile>(null);

  useEffect(() => {
    // retrieve user notification preference
    const fetchProfile = async () => {
      const res = await axiosPrivate.get(getProfileURL + user.username);
      if (res.status === 200) {
        if (res.data.statusCode === 200) {
          setNotificationCourses(res.data.data[0]["notificationPreference"]);
          setProfileData(res.data.data[0]);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h3">Notification Settings</Typography>
      <Typography variant="h6">Select the kinds of notifications you get about your subscribed threads.</Typography>
      {notificationCourses?.map((course) => {
        return (
          <Box key={course.courseName}>
            <NotificationCourse course={course} profileData={profileData} />
          </Box>
        );
      })}
      <LoadingButton variant="contained">Save</LoadingButton>
    </Box>
  );
};

export default NotificationPreference;
