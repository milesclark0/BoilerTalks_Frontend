import React, { useEffect } from "react";
import { Box, CardContent, CardHeader, Paper, Typography } from "@mui/material";
import { Notification } from "../../globals/types";
import { StyledDivider } from "../SideBar/components/StyledDivider";

type Props = {
  notifications: Notification[];
};

const NotificationHome = ({ notifications }: Props) => {
  // const axiosPrivate = useAxiosPrivate();
  // const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader title="Notifications" sx={{ textAlign: "center" }} />
      <StyledDivider />
      <CardContent>
        {notifications?.map((notification, index) => {
          return (
            <React.Fragment key={index}>
              <Typography>{notification.courseName}</Typography>
              <Typography>{notification.notification}</Typography>
              <Typography>{new Date(notification.date.$date).toLocaleString()}</Typography>
            </React.Fragment>
          );
        })}
      </CardContent>
    </Box>
  );
};

export default NotificationHome;
