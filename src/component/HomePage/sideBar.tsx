import styled from "@emotion/styled";
import { Divider, Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar, Menu, MenuItem, Button } from "@mui/material";
import { Course, User } from "../../types/types";
import React from "react";
import { useState } from "react";
import { Settings } from "@mui/icons-material";
import useLogout from "./../../hooks/useLogout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { setCourseActiveURL } from "../../API/CoursesAPI";
import { useAuth } from "../../context/context";
import PushPinIcon from '@mui/icons-material/PushPin';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

type Props = {
  user: User;
  activeIcon: { course: string; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course | null;
  getDistinctCoursesByDepartment: (department: string) => Course[];
};

const SideBar = ({ user, activeIcon, setActiveIcon, drawerWidth, innerDrawerWidth, currentCourse, getDistinctCoursesByDepartment, appBarHeight }: Props) => {
  const api = useAxiosPrivate();
  const { setUser } = useAuth();
  const AvatarSize = { width: 50, height: 50 };
  const selectedIconColor = "#7e7e7e";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(anchorEl);
  const logout = useLogout();
  const navigate = useNavigate();

  // get distinct departments from course list
  const distinctDepartments = [...new Set(user?.courses.map((course) => course.split(" ")[0]))];

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

  const handleIconClick = (course: string, isActiveCourse: boolean) => {
    //add delay to prevent rerendering before the button animation is done
    setTimeout(() => {
      setActiveIcon({ course: course, isActiveCourse: isActiveCourse });
    }, 200);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const BoilerTracksIcon = () => {
    const outLineColor = activeIcon.course === "" ? selectedIconColor : "";
    const outlineStyle = activeIcon.course === "" ? "solid" : "";
    return (
      <ListItem>
        <IconButton onClick={() => handleIconClick("", false)}>
          <Avatar sx={{ ...AvatarSize, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
            <Typography sx={{marginTop: '5px'}}><HomeIcon /></Typography>
          </Avatar>
        </IconButton>
      </ListItem>
    );
  };

  const StyledDivider = () => {
    return (
      <Divider
        sx={{
          borderColor: "rgba(7, 7, 7, 0.199)",
        }}
      />
    );
  };

  const activeCourseSwitch = async (course: Course) => {
    try {
      const res = await api.post(setCourseActiveURL, {courseName: course?.name, username: user?.username});
      console.log(res);

      if (res.data.statusCode == 200) {
        if (res.data.data == 'removing') {
          setUser({...user, activeCourses:[...user.activeCourses.filter(courseName => course?.name != courseName)]});
        } else {
          setUser({...user, activeCourses:[...user.activeCourses, course?.name]});
        }      
        
      } else {
        alert('Error'); 
      }
    } catch(error) {
      console.log(error);
    }
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const SettingsMenu = () => {
    return (
      <Menu open={settingsOpen} anchorEl={anchorEl} onClose={handleSettingsClose}>
        <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center" }}>{user?.username}</MenuItem>
        <StyledDivider />
        <MenuItem>Settings</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    );
  };

  const CourseIcon = ({ labelText, isActiveCourse }: { labelText: string; isActiveCourse: boolean }) => {
    const iconColor = isActiveCourse ? "lightblue" : "";
    const outLineColor = activeIcon.course === labelText ? selectedIconColor : "";
    const outlineStyle = activeIcon.course === labelText ? "solid" : "";
    const [department, courseNumber] = labelText.split(" ");
    const label = isActiveCourse ? department + " " + courseNumber : department
    return (
      <ListItem>
        <IconButton onClick={() => handleIconClick(labelText, isActiveCourse)}>
          <Avatar sx={{ ...AvatarSize, bgcolor: iconColor, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
            <Typography color="black" variant="body2">{label}</Typography>
          </Avatar>
        </IconButton>
      </ListItem>
    );
  };

  const PinIcon = ({course} : {course: Course}) => {
    const isActiveCourse = user.activeCourses?.includes(course?.name);
    return (
      <IconButton onClick={() => activeCourseSwitch(course)}
      sx={{transform: "rotate(45deg)"}}>
      {/* {user.activeCourses?.includes(course?.name) && <PushPinIcon />} */}
        {isActiveCourse && <PushPinIcon color="primary" />}
        {!isActiveCourse && <PushPinIcon />}
      </IconButton>
    );
  }

  const CourseNavigation = ({ course }: { course: Course }) => {
    return (
      <List>
        <ListItem>
          <Typography variant="body1" noWrap component="div">
            {course?.name}
          </Typography>
          <PinIcon course={course} />
        </ListItem>
        <StyledDivider />
        <ListItem>
          <List>
            <Button
              sx={{
                width: "100%",
              }}
            >
              <ListItem>
                <Typography variant="body2" noWrap component="div">
                  General Chat
                </Typography>
              </ListItem>
            </Button>
            {/* <ListItem>
                <Typography variant="body1" noWrap component="div">
                  Mod Chat
                </Typography>
              </ListItem> */}
            <Button
              sx={{
                width: "100%",
              }}
            >
              <ListItem>
                <Typography variant="body2" noWrap component="div">
                  Thread
                </Typography>
              </ListItem>
            </Button>
          </List>
        </ListItem>
      </List>
    );
  };

  const CourseView = () => {
    // if no course is selected, show boilertracks home
    if (activeIcon.course === "") {
      return (
        <List>
          <ListItem>
            <Typography variant="h6" noWrap component="div">
              BoilerTracks Home
            </Typography>
          </ListItem>
          <StyledDivider />
        </List>
      );
    }
    // if a course is selected, show course navigation
    if (activeIcon.isActiveCourse) {
      return <CourseNavigation course={currentCourse} />;
    }
    // if a department is selected, show course list
    return (
      <List>
        <ListItem>
          <Typography variant="h6" noWrap component="div">
            {activeIcon.course} Courses
          </Typography>
        </ListItem>
        <StyledDivider />
          {getDistinctCoursesByDepartment(activeIcon.course).map((course) => (
            <React.Fragment key={course.name + course.semester}>
              <CourseNavigation course={course} />
              <StyledDivider />
            </React.Fragment>
          ))}
      </List>
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
          <SettingsMenu />
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
          <CourseView />
        </Box>
        <Drawer sx={InnerDrawerStyles} variant="permanent" anchor="left">
          <List>
            <BoilerTracksIcon />
            <StyledDivider />
            {user.activeCourses?.map((course: string) => (
              <React.Fragment key={course}>
                <CourseIcon labelText={course} isActiveCourse={true} />
              </React.Fragment>
            ))}
            {user.activeCourses.length > 0 && <StyledDivider />}
            {distinctDepartments.map((course: string) => (
              <React.Fragment key={course}>
                <CourseIcon labelText={course} isActiveCourse={false} />
              </React.Fragment>
            ))}
          </List>
        </Drawer>
      </Drawer>
    </Box>
  );
};

export default SideBar;
