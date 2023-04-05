import React, {useEffect} from 'react'
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import {
  Box,

} from "@mui/material";
import { getProfileURL } from '../../API/ProfileAPI';
import NotificationCourse from '../Notification/NotificationCourse';
import { Profile } from '../../globals/types';

type NotificationPreference = {
  courseName: string;
  messages: boolean;
  appeals: boolean;
  reports: boolean;
};

const NotificationPreference = () => {
  const [notificationCourses, setNotificationCourses] = useState<NotificationPreference[]>(null);
  const axiosPrivate = useAxiosPrivate();
  const {user} = useAuth();
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
      {notificationCourses?.map((course) => {
        return <NotificationCourse course={course} profileData={profileData}/>;
      })}
    </Box>
  );
}

export default NotificationPreference