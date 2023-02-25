import { Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar } from "@mui/material";
import { Course, User } from "../../types/types";
import React from "react";
import { useEffect, useState } from "react";
import { Settings } from "@mui/icons-material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/context";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CourseIcon } from "../SideBar/CourseIcon";
import { StyledDivider } from "../SideBar/StyledDivider";
import { SettingsMenu } from "../SideBar/SettingsMenu";
import { CourseNavigation } from "../SideBar/CourseView/CourseNavigation";
import { CourseView } from "../SideBar/CourseView/CourseView";

type Props = {
  user: User;
  activeIcon: { course: string; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course | null;
  distinctCoursesByDepartment: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
};

const SideBar = ({ ...props }: Props) => {
  const [newThreadOpen, setNewThreadOpen] = useState(false); //whether a create new thread dialogue is open or not
  const [newThreadValue, setNewThreadValue] = useState(""); //What the new thread name string is
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedIconColor = "#7e7e7e";
  const AvatarSize = { width: 50, height: 50 };
  const {
    user,
    activeIcon,
    setActiveIcon,
    drawerWidth,
    innerDrawerWidth,
    appBarHeight,
    currentCourse,
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    setCurrentCourse,
    distinctDepartments,
    setDistinctDepartments,
  } = props;

  const OuterDrawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
    },
    position: "fixed",
  };

  const InnerDrawerStyles = {
    width: innerDrawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: innerDrawerWidth,
      boxSizing: "border-box",
      overflow: "hidden",
      borderColor: "rgba(7, 7, 7, 0.199)",
      overflowY: "scroll",
      paddingTop: `${appBarHeight}px`,
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
    //add delay to prevent rerendering before the button animation is done
    setTimeout(() => {
      setActiveIcon({ course: course, isActiveCourse: isActiveCourse });
    }, 200);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const CourseIconProps = {
    activeIcon,
    setActiveIcon,
    handleIconClick,
    selectedIconColor,
    AvatarSize,
  };

  const SettingsMenuProps = {
    anchorEl,
    setAnchorEl,
  };

  const CourseViewProps = {
    activeIcon,
    currentCourse,
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    distinctDepartments,
    setDistinctDepartments,
    setActiveIcon,
    newThreadOpen,
    setNewThreadOpen,
    newThreadValue,
    setNewThreadValue,
    setCurrentCourse,
  };

  const BoilerTalksIcon = () => {
    const outLineColor = activeIcon.course === "" ? selectedIconColor : "";
    const outlineStyle = activeIcon.course === "" ? "solid" : "";
    return (
      <ListItem>
        <IconButton onClick={() => handleIconClick("", false)}>
          <Avatar sx={{ ...AvatarSize, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
            <Typography sx={{ marginTop: "5px" }}>
              <HomeIcon />
            </Typography>
          </Avatar>
        </IconButton>
      </ListItem>
    );
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ width: drawerWidth, left: 0, height: appBarHeight }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hi, {user?.username}
          </Typography>
          <IconButton onClick={handleSettingsClick}>
            <Settings />
          </IconButton>
          <SettingsMenu {...SettingsMenuProps} />
        </Toolbar>
      </AppBar>
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
        <Box
          sx={{
            display: "flex",
            paddingLeft: `${innerDrawerWidth}px`,
            paddingTop: `${appBarHeight}px`,
          }}
        >
          <CourseView {...CourseViewProps} />
        </Box>
        <Drawer sx={InnerDrawerStyles} variant="permanent" anchor="left">
          <List>
            <BoilerTalksIcon />
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
        </Drawer>
      </Drawer>
    </Box>
  );
};

export default SideBar;
