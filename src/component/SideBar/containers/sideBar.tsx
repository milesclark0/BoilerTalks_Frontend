import { Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar } from "globals/mui";
import { Course, Room, User } from "globals/types";
import { APP_STYLES } from "globals/globalStyles";
import React from "react";
import { useEffect, useState } from "react";
import { Settings } from "@mui/icons-material";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useAuth } from "context/context";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CourseIcon } from "../components/CourseIcon";
import { StyledDivider } from "../components/StyledDivider";
import { SettingsMenu } from "../components/SettingsMenu";
import { CourseNavigation } from "./CourseNavigation";
import { CourseView } from "./CourseView";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ThemeSwitch from "../components/themeSwitch";
import useStore from "store/store";

const SideBar = ({ ...props }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeIcon, setActiveIcon, setDistinctDepartments, setCurrentCourse, userCourseList] = useStore((state) => [
    state.activeIcon,
    state.setActiveIcon,
    state.setDistinctDepartments,
    state.setCurrentCourse,
    state.userCourseList,
  ]);

  const OuterDrawerStyles = {
    width: APP_STYLES.DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: APP_STYLES.DRAWER_WIDTH,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
    },
    position: "fixed",
  };

  const InnerDrawerStyles = {
    width: APP_STYLES.INNER_DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: APP_STYLES.INNER_DRAWER_WIDTH,
      boxSizing: "border-box",
      overflow: "hidden",
      borderColor: "rgba(7, 7, 7, 0.199)",
      overflowY: "scroll",
      paddingTop: `${APP_STYLES.APP_BAR_HEIGHT}px`,
      "&::-webkit-scrollbar": {
        display: "none",
      },
      alignItems: "center",
    },
  };
  // get distinct departments from course list

  useEffect(() => {
    const distinctDepartments = [...new Set(user?.courses.map((course) => course.split(" ")[0]))];
    setDistinctDepartments(distinctDepartments);
  }, []);

  const handleIconClick = (course: string, isActiveCourse: boolean) => {
    if (course === activeIcon.course) {
      return;
    }
    if (course === "") {
      // home button is clicked
      setCurrentCourse(null);
    }
    setActiveIcon(course, isActiveCourse);
    updateActiveIcon(course, isActiveCourse);
  };

  function updateActiveIcon(course, isActiveCourse) {
    //runs when SideBar icon is clicked
    if (isActiveCourse) {
      //if the icon is a course, not a department
      userCourseList.forEach((c) => {
        if (c.name === course) {
          navigate(`/home/courses/${c._id.$oid}/${c?.rooms[0][1].$oid}`, {
            replace: true,
          });
        }
      });
    } else {
      //if the icon is a department or is not set
      if (course === "") {
        navigate(`/home`, {
          replace: true,
        });
      } else {
        navigate(`/home/courses`, {
          replace: true,
        });
      }
    }
  }

  return (
    <Box>
      <SideAppBar />
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
        <Box
          sx={{
            display: "flex",
            paddingLeft: `${APP_STYLES.INNER_DRAWER_WIDTH}px`,
            paddingTop: `${APP_STYLES.APP_BAR_HEIGHT}px`,
          }}
        >
          {/* Outer Side Bar */}
          <CourseView />
        </Box>
        {/* Inner Side Bar */}
        <Drawer sx={InnerDrawerStyles} variant="permanent" anchor="left">
          <CourseIconsList handleIconClick={handleIconClick} />
        </Drawer>
      </Drawer>
    </Box>
  );
};

const GetProfilePicture = () => {
  const { user } = useAuth();
  return <Avatar sx={{ width: 50, height: 50, mr: 2 }} src={user?.profilePicture + `?${Date.now()}`} />;
};

type CourseIconProps = {
  handleIconClick: (course: string, isActiveCourse: boolean) => void;
  AvatarSize: { width: number; height: number };
  selectedIconColor: string;
};

const BoilerTalksIcon = ({ AvatarSize, handleIconClick, selectedIconColor }: CourseIconProps) => {
  const activeIcon = useStore((state) => state.activeIcon);
  const outLineColor = activeIcon.course === "" ? selectedIconColor : "";
  const outlineStyle = activeIcon.course === "" ? "solid" : "";
  return (
    <ListItem>
      <IconButton onClick={() => handleIconClick("", false)}>
        <Avatar
          sx={{
            ...AvatarSize,
            outlineColor: outLineColor,
            outlineStyle: outlineStyle,
          }}
        >
          <Typography sx={{ marginTop: "5px" }}>
            <HomeIcon />
          </Typography>
        </Avatar>
      </IconButton>
    </ListItem>
  );
};

type CourseListProps = {
  handleIconClick: (course: string, isActiveCourse: boolean) => void;
};
const CourseIconsList = ({ handleIconClick }: CourseListProps) => {
  const { user, themeSetting } = useAuth();
  const distinctDepartments = useStore((state) => state.distinctDepartments);
  const selectedIconColor = themeSetting === "light" ? "#302f2f" : "#faf8f8";
  const AvatarSize = { width: 50, height: 50 };
  const CourseIconProps = {
    handleIconClick: handleIconClick,
    AvatarSize: AvatarSize,
    selectedIconColor: selectedIconColor,
  };
  return (
    <List>
      <BoilerTalksIcon {...CourseIconProps} />
      <StyledDivider />
      {user.activeCourses?.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon labelText={course} isActiveCourse={true} {...CourseIconProps} />
        </React.Fragment>
      ))}
      {user.activeCourses.length > 0 && <StyledDivider />}
      {distinctDepartments.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon labelText={course} isActiveCourse={false} {...CourseIconProps} />
        </React.Fragment>
      ))}
    </List>
  );
};

const SideAppBar = () => {
  const { user, profile } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeChecked, setThemeChecked] = useState(false || localStorage.getItem("themeSetting") === "dark");

  const { handleThemeSettingChange } = useAuth();

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeChecked = () => {
    handleThemeSettingChange();
    setThemeChecked(!themeChecked);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: APP_STYLES.DRAWER_WIDTH,
        left: 0,
        height: APP_STYLES.APP_BAR_HEIGHT,
      }}
    >
      <Toolbar>
        <GetProfilePicture />
        <Typography variant="body2" noWrap component="div" sx={{ flexGrow: 1 }}>
          {profile?.displayName || user?.username}
        </Typography>
        <FormControlLabel control={<ThemeSwitch sx={{ m: 1 }} checked={themeChecked} onChange={() => handleThemeChecked()} />} label="" />
        <IconButton onClick={handleSettingsClick}>
          <Settings />
        </IconButton>
        <SettingsMenu {...{ anchorEl, setAnchorEl }} />
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(SideBar);
