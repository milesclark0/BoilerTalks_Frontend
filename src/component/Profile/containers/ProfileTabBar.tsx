import { Tabs, Tab, Box, Typography, Paper, useTheme } from "@mui/material";
import React from "react";
import { useAuth } from "../../../context/context";
import { User, Profile, Course } from "../../../globals/types";
import CoursesTab from "../components/CoursesTab";
import { useQuery } from "react-query";
import { getUserCoursesAndRoomsURL } from "../../../API/CoursesAPI";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ModCoursesTab from "../components/ModCoursesTab";
import BlockedUsersTab from "../components/BlockedUsersTab";
import PasswordReset from "../../Settings/PasswordReset";
import DisplayNameTab from "../components/DisplayNameTab";

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
        <Box sx={{ p: 3, width: 500 }}>
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
  setViewedUser: React.Dispatch<React.SetStateAction<User>>;
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

  //gets the courses of the user that is being viewed
  const [currentUserCourses, setCurrentUserCourses] = React.useState<Course[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesAndRoomsURL + props.viewedUser?.username);
  };

  useQuery("courses: " + props.viewedUser?.username, fetchCourse, {
    enabled: true,
    //refetchInterval: 1000 * 60 * 2, //2 minutes
    staleTime: 1000 * 60 * 10, //10 minutes
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        const sortedCourses = sortCoursesByDepartment(data.data.data[0]);
        setCurrentUserCourses(sortedCourses);
        //console.log(sortedCourses);
      }
    },
  });

  function sortCoursesByDepartment(courses: Course[]) {
    courses.sort((a, b) => (a.department < b.department ? -1 : 1));
    return courses;
  }
  // public tabs: Courses, Modded Courses
  const publicTabsIndexCutOff = 1;
  const tabPanelOptions = ["Courses", "Modded Courses", "Blocked Users", "Change Password", "Change Display Name"];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const CurrentTab = ({ index }) => {
    switch (tabPanelOptions[index]) {
      case "Courses":
        return <CoursesTab {...props} currentUserCourses={currentUserCourses} />;
      case "Modded Courses":
        return <ModCoursesTab {...props} currentUserCourses={currentUserCourses} />;
      case "Blocked Users":
        return <BlockedUsersTab {...props} />;
      case "Change Password":
        return <PasswordReset />;
      case "Change Display Name":
        return <DisplayNameTab {...props} />;
    }
  };

  const tabStyles = {
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
  };
  return (
    <Paper sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", borderRadius: "2%", height: "60vh", p: 2 }}>
      <Tabs sx={tabStyles} orientation="vertical" variant="scrollable" value={value} onChange={handleChange}>
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
