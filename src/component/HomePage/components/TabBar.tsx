import React, { useState } from "react";
import { Box, Typography, Tab, Tabs, AppBar } from "@mui/material";
import { APP_STYLES } from "../../../globals/globalStyles";
import useStore from "../../../store/store";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AddIcon from "@mui/icons-material/Add";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const TabBar = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
        height: APP_STYLES.APP_BAR_HEIGHT,
      }}
    >
    {/* <Box> */}
      <Tabs
        value={value}
        onChange={handleTabChange}
        sx={{
          minHeight: APP_STYLES.APP_BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          ".Mui-selected": {
            color: "blue",
          },
        }}
        centered
        // orientation="vertical"
        // textColor="primary"
        // variant="fullWidth"
      >
        <Tab icon={<NotificationsIcon />} label="Notifications" />
        <Tab icon={<AnnouncementIcon />} label="Announcements" />
        {/* <Tab icon={<AddIcon />} label="Add Courses" /> */}
      </Tabs>
      {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel> */}
      </AppBar>
    // </Box>
  );
};

export default TabBar;