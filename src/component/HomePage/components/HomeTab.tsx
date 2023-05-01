import React, { useState } from "react";
import { Box, Tab, Tabs, Paper, Badge, useTheme } from "globals/mui";
import ReleaseNotes from "component/ReleaseNotes/ReleaseNotes";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import NotificationHome from "component/Notification/NotificationHome";
import { Notification } from "globals/types";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "context/context";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { updateSeenNotificationURL } from "API/ProfileAPI";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <Box role="verticaltabpanel" hidden={value !== index} sx={{ flex: 1 }}>
      {value === index && <Box sx={{ height: "100%" }}>{children}</Box>}
    </Box>
  );
}

type Props = {
  notifications: Notification[];
  badgeCount: number;
  setBadgeCount: React.Dispatch<React.SetStateAction<number>>;
};

const HomeTab = ({ notifications, badgeCount, setBadgeCount }: Props) => {
  const [value, setValue] = useState<number>(0);
  const { themeSetting, user } = useAuth();
  const theme = useTheme();
  const axiosPrivate = useAxiosPrivate();

  const updateSeenNotification = async () => {
    try {
      const res = await axiosPrivate.post(updateSeenNotificationURL + user?.username, {
        notifications: notifications,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue == 1) {
      // if notification tab is clicked
      setBadgeCount(0);
      updateSeenNotification();
    }
    setValue(newValue);
  };

  return (
    <Paper elevation={5} sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "row" }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{
          borderRight: 1,
          borderColor: "rgba(7, 7, 7, 0.199)",
          ".Mui-selected": {
            color: `${theme.palette.secondary.main} !important`,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: `${theme.palette.secondary.main} !important`,
          },
        }}
      >
        <Tab label="Release Notes" icon={<AnnouncementIcon />} sx={{ color: themeSetting === "light" ? "black" : "white" }} />
        <Tab
          label="Notifications"
          icon={
            <Badge badgeContent={badgeCount} color="secondary" variant="dot">
              <NotificationsIcon />
            </Badge>
          }
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ReleaseNotes />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NotificationHome notifications={notifications} />
      </TabPanel>
    </Paper>
  );
};

export default HomeTab;
