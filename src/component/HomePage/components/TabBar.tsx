import React, { useState } from "react";
import { Box, Typography, Tab, Tabs, AppBar, Button } from "@mui/material";
import { APP_STYLES } from "../../../globals/globalStyles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AddIcon from "@mui/icons-material/Add";
import SearchCourseModal from "../../ThreadDisplay/searchCourseModal";
import ReleaseNotes from "../../ReleaseNotes/ReleaseNotes";
import { useAuth } from "../../../context/context";

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

const TabBar = () => {
  const [value, setValue] = useState(0);
  const [showCourses, setShowCourses] = useState<boolean>(false);
  const {themeSetting} = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 2) {
      // add courses index
      setShowCourses(true);
    } else {
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
          icon={<NotificationsIcon />}
          label="Notifications"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
        <Tab
          icon={<AnnouncementIcon />}
          label="Release Notes"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
        <Tab
          icon={<AddIcon />}
          label="Add Courses"
          sx={{ color: themeSetting === "light" ? "black" : "white" }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReleaseNotes />
      </TabPanel>
      <SearchCourseModal {...searchCourseProps} />
    </AppBar>
  );
};

export default TabBar;
