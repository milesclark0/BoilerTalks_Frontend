import React, { useEffect } from "react";
import { Box, CardContent, CardHeader, Divider, Typography } from "globals/mui";
import { Notification } from "globals/types";
import { StyledDivider } from "component/SideBar/components/StyledDivider";
import useStore from "store/store";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FeedIcon from "@mui/icons-material/Feed";
import MessageIcon from "@mui/icons-material/Message";
import FlagIcon from "@mui/icons-material/Flag";
import { useAuth } from "context/context";

type Props = {
  notifications: Notification[];
};

const NotificationHome = ({ notifications }: Props) => {
  const [userRoomsList] = useStore((state) => [state.userRoomsList]);
  const { themeSetting } = useAuth();

  const findRoomName = (notiString: string, courseName: string) => {
    if (notiString.split(" ")[3] != undefined) {
      const room = userRoomsList?.find((room) => room._id.$oid === notiString.split(" ")[3]);
      return "new message in " + room?.name.replace(courseName, "");
    }
    return "new " + notiString;
  };

  const notiColorType = (notiType: string) => {
    let bgColor = themeSetting === "dark" ? "#006EFA" : "#72ADF9";
    if (notiType === "Appeal") {
      bgColor = themeSetting === "dark" ? "#8E3AE8" : "#CC68F4";
    } else if (notiType === "Report") {
      bgColor = themeSetting === "dark" ? "#EF8E0A" : "#F4E768";
    }

    return {
      bgcolor: bgColor,
    };
  };

  const notificationType = (notiString: string) => {
    let notiType = "Message";
    if (notiString == "appeal") {
      notiType = "Appeal";
    } else if (notiString == "report") {
      notiType = "Report";
    }
    return (
      <Box
        sx={{
          borderRadius: 2,
          ml: 2,
          display: "flex",
          alignItems: "center",
          ...notiColorType(notiType),
          p: 1,
        }}
      >
        {notiType === "Appeal" && <FeedIcon />}
        {notiType === "Report" && <FlagIcon />}
        {notiType === "Message" && <MessageIcon />}
        <Typography sx={{ ml: 1 }}>{notiType}</Typography>
      </Box>
    );
  };

  const dateDisplay = (dateString: string) => {
    const [date, time] = new Date(dateString)
      .toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .split(", ");
    return date + " at " + time;
  };

  const marginBottomStyle = (index: number) => {
    let marginBottom = 2;
    // last index since we only render 15
    if (index === 14) {
      marginBottom = 0;
    }
    return {
      mb: marginBottom,
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader title="Notifications" sx={{ textAlign: "center" }} />
      <StyledDivider />
      <CardContent sx={{ overflowY: "auto", mb: 2 }} className="scrollBar">
        {notifications
          // render the last 15 notifications
          ?.slice(notifications.length <= 15 ? 0 : notifications.length - 15, notifications?.length)
          .reverse()
          .map((notification, index) => {
            return (
              <Box key={index} sx={{ ...marginBottomStyle(index) }}>
                <Box sx={{ ml: 2, mr: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography>{notification.courseName}</Typography>
                      {notificationType(notification.notification)}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon />
                      <Typography sx={{ ml: 2 }}>{dateDisplay(notification.date.$date)}</Typography>
                    </Box>
                  </Box>
                  <Typography>{findRoomName(notification.notification, notification.courseName)}</Typography>
                </Box>
                {index !== notifications.length - 1 && <Divider variant="middle" sx={{ mt: 2, borderColor: "rgba(7, 7, 7, 0.199)" }} />}
              </Box>
            );
          })}
      </CardContent>
    </Box>
  );
};

export default NotificationHome;
