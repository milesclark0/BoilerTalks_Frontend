import React, { useState } from "react";
import { Box, Tab, Tabs, AppBar, useTheme } from "globals/mui";
import { APP_STYLES } from "globals/globalStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchCourseModal from "component/ThreadDisplay/components/searchCourseModal";
import { useAuth } from "context/context";
import HomeIcon from "@mui/icons-material/Home";
import { Notification } from "globals/types";
import HomeTab from "./HomeTab";

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
            p: 8,
            // overflowY: "auto",
            // maxHeight: `calc(100vh - ${APP_STYLES.APP_BAR_HEIGHT}px)`,
            height: `calc(100vh - ${APP_STYLES.APP_BAR_HEIGHT}px)`,
            boxSizing: "border-box",
          }}
          id={"tab" + index}
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
  const { themeSetting } = useAuth();
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
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
            color: `${theme.palette.secondary.main} !important`,
          },
        }}
        // TabIndicatorProps={{ style: { backgroundColor: "white" } }}
        centered
      >
        <Tab icon={<HomeIcon />} label="Home" sx={{ color: themeSetting === "light" ? "black" : "white" }} />
        <Tab icon={<AddIcon />} label="Add Courses" sx={{ color: themeSetting === "light" ? "black" : "white" }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <HomeTab notifications={notifications} badgeCount={badgeCount} setBadgeCount={setBadgeCount} />
      </TabPanel>
      <SearchCourseModal {...searchCourseProps} />
    </AppBar>
  );
};

export default TabBar;
