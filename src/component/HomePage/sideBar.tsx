import styled from "@emotion/styled";
import { Divider, Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar, Menu, MenuItem } from "@mui/material";
import { User } from "../../types/types";
import React from "react";
import { useState } from "react";
import { Settings } from "@mui/icons-material";
import useLogout from './../../hooks/useLogout';

type Props = {
  user: User;
  activeIcon: { course: String; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  drawerWidth: number;
  innerDrawerWidth: number;
};

const SideBar = ({ user, activeIcon, setActiveIcon, drawerWidth, innerDrawerWidth }: Props) => {
  const appBarHeight = 64;
  const AvatarSize = { width: 50, height: 50 };
  const selectedIconColor = "#7e7e7e";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(anchorEl);
  const logout = useLogout();

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
      overflowY: "auto",
      marginTop: `${appBarHeight}px`,
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
            <Typography>BT</Typography>
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

  const SettingsMenu = () => {
    return (
      <Menu
        open={settingsOpen}
        anchorEl={anchorEl}
        onClose={handleSettingsClose}
      >
        <MenuItem sx={{ pointerEvents: "none", justifyContent: "center"}}>{user?.username}</MenuItem>
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
    const department = labelText.split(" ")[0];

    return (
      <ListItem>
        <IconButton onClick={() => handleIconClick(labelText, isActiveCourse)}>
          <Avatar sx={{ ...AvatarSize, bgcolor: iconColor, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
            <Typography>{department}</Typography>
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
          <SettingsMenu />
        </Toolbar>
      </AppBar>
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
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
