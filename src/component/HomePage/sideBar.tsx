import styled from "@emotion/styled";
import { Divider, Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar, Menu, MenuItem, Button } from "@mui/material";
import { Course, Room, User } from "../../types/types";
import React from "react";
import { useState } from "react";
import { Settings } from "@mui/icons-material";
import useLogout from "./../../hooks/useLogout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { setCourseActiveURL } from "../../API/CoursesAPI";
import { useAuth } from "../../context/context";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { axiosPrivate } from "../../API/axios";
import { unsubscribeFromCourseURL } from "./../../API/CoursesAPI";
import { render } from "react-dom";

type Props = {
  user: User;
  activeIcon: { course: string; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course | null;
  getDistinctCoursesByDepartment: (department: string) => Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
};

const SideBar = ({
  user,
  activeIcon,
  setActiveIcon,
  drawerWidth,
  innerDrawerWidth,
  currentCourse,
  getDistinctCoursesByDepartment,
  setUserCourses,
  userCourses,
  appBarHeight,
}: Props) => {
  const api = useAxiosPrivate();
  const { setUser } = useAuth();
  const AvatarSize = { width: 50, height: 50 };
  const selectedIconColor = "#7e7e7e";
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(anchorEl);
  const logout = useLogout();

  const [newThreadOpen, setnewThreadOpen] = React.useState(false); //whether a create new thread dialogue is open or not
  const [newThreadValue, setnewThreadValue] = React.useState(""); //What the new thread name string is

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

  const navigateToSettings = () => {
    navigate("/settings");
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
      const res = await api.post(setCourseActiveURL, { courseName: course?.name, username: user?.username });
      console.log(res);

      if (res.data.statusCode == 200) {
        if (res.data.data == "removing") {
          setUser({ ...user, activeCourses: [...user.activeCourses.filter((courseName) => course?.name != courseName)] });
        } else {
          setUser({ ...user, activeCourses: [...user.activeCourses, course?.name] });
        }
      } else {
        alert("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SettingsMenu = () => {
    return (
      <Menu open={settingsOpen} anchorEl={anchorEl} onClose={handleSettingsClose}>
        <MenuItem sx={{ pointerEvents: "none", justifyContent: "center" }}>{user?.username}</MenuItem>
        <StyledDivider />
        <MenuItem onClick={navigateToSettings}>Settings</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    );
  };

  const CourseIcon = ({ labelText, isActiveCourse }: { labelText: string; isActiveCourse: boolean }) => {
    const iconColor = isActiveCourse ? "lightblue" : "";
    const outLineColor = activeIcon.course === labelText ? selectedIconColor : "";
    const outlineStyle = activeIcon.course === labelText ? "solid" : "";
    const [department, courseNumber] = labelText.split(" ");
    const label = isActiveCourse ? department + " " + courseNumber : department;
    return (
      <ListItem>
        <IconButton onClick={() => handleIconClick(labelText, isActiveCourse)}>
          <Avatar sx={{ ...AvatarSize, bgcolor: iconColor, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
            <Typography color="black" variant="body2">
              {label}
            </Typography>
          </Avatar>
        </IconButton>
      </ListItem>
    );
  };

  const PinIcon = ({ course }: { course: Course }) => {
    const isActiveCourse = user.activeCourses?.includes(course?.name);
    const color = isActiveCourse ? "primary" : "disabled";
    return (
      <IconButton onClick={() => activeCourseSwitch(course)} sx={{ transform: "rotate(45deg)" }}>
        <PushPinIcon color={color} />
      </IconButton>
    );
  };

  const MoreIcon = ({ course }: { course: Course }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLeaveServer = async () => {
      const ret = await api.post(unsubscribeFromCourseURL, { courseName: course.name, username: user.username });
      if (ret.data.statusCode == 200) {
        setUser({ ...user, courses: user.courses.filter((c) => c != course.name) });
        setUserCourses([...userCourses.filter((c) => c.name != course.name)]);
        if (course.name == activeIcon.course) {
          setActiveIcon({ course: "", isActiveCourse: false });
          setUser({ ...user, activeCourses: user.activeCourses.filter((c) => c != course.name) });
        }
      } else {
        alert("Error leaving server");
      }
      handleClose();
    };

    return (
      <React.Fragment>
        <IconButton onClick={handleClick}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "20ch",
              maxHeight: 48 * 4.5,
              bgcolor: "background.paper",
            },
          }}
        >
          <MenuItem onClick={handleLeaveServer}>Leave Server</MenuItem>
          {/* {add more options for mods and what not} */}
        </Menu>
      </React.Fragment>
    );
  };

  const CourseNavigation = ({ course }: { course: Course }) => {
    return (
      <List>
        <ListItem>
          <Typography variant="body1" noWrap component="div">
            {course?.name}
          </Typography>
          <PinIcon course={course} />
          <MoreIcon course={course} />
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
                  Q&A
                </Typography>
              </ListItem>
            </Button>
            {course?.rooms?.map((room) => {
              return (
                <React.Fragment key={`${course.name}: ${room?.name}`}>
                  <Button
                    sx={{
                      width: "100%",
                    }}
                  >
                    <ListItem>
                      <Typography variant="body2" noWrap>
                        {room?.name?.replace(course?.name, "")}
                      </Typography>
                    </ListItem>
                  </Button>
                </React.Fragment>
              );
            })}
            {/* <ListItem>
                <Typography variant="body1" noWrap component="div">
                  Mod Chat
                </Typography>
              </ListItem> */}
            <Button variant="outlined" onClick={handleClickNewThread}>
              <ListItem>
                <Typography variant="body2">New thread</Typography>
              </ListItem>
            </Button>
            <Dialog open={newThreadOpen} onClose={handleCloseNewThread}>
              <DialogTitle>Create a new thread</DialogTitle>
              <DialogContent>
                <DialogContentText>To create a new thread for this course, please enter the thread name here.</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="newThreadName"
                  label="New Thread Name"
                  type="text"
                  variant="outlined"
                  value={newThreadValue}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setnewThreadValue(event.target.value); //sets the variable with every change to the string but it has a visual bug
                  }}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseNewThread}>Cancel</Button>
                <Button variant="outlined" onClick={ () => handleCreateNewThread(course)}>
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </List>
        </ListItem>
      </List>
    );
  };
  const handleClickNewThread = () => {
    setnewThreadOpen(true);
  };

  const handleCloseNewThread = () => {
    setnewThreadOpen(false);
    setnewThreadValue(""); //wipe the text field
  };

  const emptyRoom: Room = {
    _id: { $oid: "" },
    name: "Hello",
    courseId: {$oid: ""},
    connected: [{username: "", sid: ""}],
    messages: [{username: "", message: "", timeSent: {$date: ""}}],
  };

  const handleCreateNewThread = ( course: Course ) => {
    emptyRoom.name = newThreadValue;
    course?.rooms?.push(emptyRoom);
    setnewThreadOpen(false);//newThreadValue
    setnewThreadValue(""); //wipe the text field
  };

  const CourseView = () => {
    // if no course is selected, show boilertalks home
    if (activeIcon.course === "") {
      return (
        <List>
          <ListItem>
            <Typography variant="h6" noWrap component="div">
              BoilerTalks Home
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
            <BoilerTalksIcon />
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
