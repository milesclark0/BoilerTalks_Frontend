import React, { useEffect } from "react";
import { Box, CardContent, CardHeader, Paper, Typography } from "@mui/material";
import { Notification } from "../../globals/types";
import { StyledDivider } from "../SideBar/components/StyledDivider";
import useStore from "../../store/store";

type Props = {
  notifications: Notification[];
};

const NotificationHome = ({ notifications }: Props) => {
  // const axiosPrivate = useAxiosPrivate();
  // const { user } = useAuth();
  const [userRoomsList] = useStore((state) => [state.userRoomsList]);

  const findRoomName = (notiString: string) => {
    if (notiString.split(" ")[3] != undefined) {
      const room = userRoomsList?.find((room) => room._id.$oid === notiString.split(" ")[3]);
      console.log(room);
      return "new message in " + room.name;
    }
    return notiString;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader title="Notifications" sx={{ textAlign: "center" }} />
      <StyledDivider />
      <CardContent sx={{ overflowY: "auto", mb: 2 }} className="scrollBar">
        {notifications?.map((notification, index) => {        
          return (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography>{notification.courseName}</Typography>
              <Typography>{findRoomName(notification.notification)}</Typography>
              <Typography>{new Date(notification.date.$date).toLocaleString()}</Typography>
            </Box>
          );
        })}
      </CardContent>
    </Box>
  );
};

export default NotificationHome;
