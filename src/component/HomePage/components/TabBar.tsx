import React, { useState } from "react";
import { Box, Typography, Tab, Tabs, AppBar, Badge } from "@mui/material";
import { APP_STYLES } from "../../../globals/globalStyles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AddIcon from "@mui/icons-material/Add";
import SearchCourseModal from "../../ThreadDisplay/searchCourseModal";
import ReleaseNotes from "../../ReleaseNotes/ReleaseNotes";
import { useAuth } from "../../../context/context";
import NotificationHome from "../../Notification/NotificationHome";
import HomeIcon from "@mui/icons-material/Home";
import { Notification } from "../../../globals/types";
import { updateSeenNotificationURL } from "../../../API/ProfileAPI";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            p: 4,
            overflowY: "auto",
            maxHeight: `calc(100vh - ${APP_STYLES.APP_BAR_HEIGHT}px)`,
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

type Props = {
  badgeCount: number;
  setBadgeCount: React.Dispatch<React.SetStateAction<number>>;
  notifications: Notification[];
};

const TabBar = ({ badgeCount, setBadgeCount, notifications }: Props) => {
  const [value, setValue] = useState<number>(0);
  const [showCourses, setShowCourses] = useState<boolean>(false);
  const { themeSetting, user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const updateSeenNotification = async () => {
    try {
      const res = await axiosPrivate.post(updateSeenNotificationURL + user?.username, {
        notifications: notifications
      });
      console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 2) {
      // add courses index
      setShowCourses(true);
    } else {
      if (newValue == 1) {
        // if notification tab is clicked
        setBadgeCount(0);
        updateSeenNotification();
      }
      setValue(newValue);
    }
  };

  const searchCourseProps = {
    showCourses,
    setShowCourses,
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
        height: APP_STYLES.APP_BAR_HEIGHT,
      }}
    >
      <Tabs
        value={value}
        onChange={handleTabChange}
        sx={{
          minHeight: APP_STYLES.APP_BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          ".Mui-selected": {
            color: themeSetting === "light" ? "blue !important" : "teal !important",
          },
        }}
        centered
      >
        <Tab
          icon={<HomeIcon />}
          label="Home"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
        {/* <Tab
          icon={<AnnouncementIcon />}
          label="Release Notes"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        /> */}
        <Tab
          icon={
            <Badge badgeContent={badgeCount} color="secondary" variant="dot">
              <NotificationsIcon />
            </Badge>
          }
          label="Notifications"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
        <Tab
          icon={<AddIcon />}
          label="Add Courses"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
      </Tabs>
      {/* <TabPanel value={value} index={0}>
        Home
      </TabPanel> */}
      <TabPanel value={value} index={0}>
        <ReleaseNotes />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NotificationHome notifications={notifications} />
      </TabPanel>
      <SearchCourseModal {...searchCourseProps} />
    </AppBar>
  );
};

export default TabBar;
