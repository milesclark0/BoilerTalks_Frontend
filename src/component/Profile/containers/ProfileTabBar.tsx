import { Tabs, Tab, Box, Typography, Paper, useTheme } from "@mui/material";
import React from "react";
import { useAuth } from "../../../context/context";
import { User, Profile } from "../../../globals/types";
import CoursesTab from "../components/CoursesTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3, width:500 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function CustomTab(props) {
  const { themeSetting } = useAuth();
  return <Tab {...props} sx={{ color: themeSetting === "light" ? "black" : "white", minHeight: "80px" }} />;
}

interface GridProps {
  viewedUser: User;
  profileInfo: Profile;
  uploadProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedUserProfile: boolean;
  setProfileInfo: React.Dispatch<React.SetStateAction<Profile>>;
  image: string;
}

const ProfileTabBar = ({ ...props }: GridProps) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const { themeSetting } = useAuth();
  // public tabs: Courses, Modded Courses
  const publicTabsIndexCutOff = 1
  const tabPanelOptions = ["Courses", "Modded Courses", "Blocked Users", "Change Password", "Change Theme", "Change Display Name"];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const CurrentTab = ({index}) => {
    switch (index) {
      case 0:
        return <CoursesTab {...props} />;
    }
  }
  return (
    <Paper sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", borderRadius: "2%", height: 1 }}>
      <Tabs
        sx={{
          borderRight: 1,
          m: 2,
          borderColor: "divider",
          ".Mui-selected": {
            color: `${theme.palette.secondary.main} !important`,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: `${theme.palette.secondary.main} !important`,
          },
          width: "25%",
        }}
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
      >
        {tabPanelOptions.map((option, index) => {
          if (!props.isLoggedUserProfile && index > publicTabsIndexCutOff) {
            return null;
          }
          return <CustomTab label={option} key={index} />;
        })}
      </Tabs>
      {tabPanelOptions.map((option, index) => {
        if (!props.isLoggedUserProfile && index > publicTabsIndexCutOff) {
          return null;
        }
        return (
          <TabPanel value={value} index={index} key={index}>
            <CurrentTab index={index} />
          </TabPanel>
        );
      })}
    </Paper>
  );
};

export default ProfileTabBar;