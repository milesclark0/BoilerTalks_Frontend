import React, { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/context";
import { Box, Typography, Tab, Tabs, AppBar, Badge } from "@mui/material";
import { Notification } from "../../globals/types";

type Props = {
  notifications: Notification[]
}
 
const NotificationHome = ({ notifications }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  return (
    <Box>
      {notifications?.map((notification, index) => {
        return (
          <React.Fragment key={index}>
            <Typography>{notification.courseName}</Typography>
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default NotificationHome;
