import { Drawer, Box, List, ListItem, ListItemText, Typography, Button, Avatar } from "@mui/material";
import React from "react";
import { useAuth } from "../../context/context";
import { Course } from "../../types/types";
import ProfilePage from "./../../pages/ProfilePage";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
};

const UserBar = ({ drawerWidth, innerDrawerWidth, appBarHeight, currentCourse }: Props) => {
  const { user } = useAuth();
  const newWidth = drawerWidth - innerDrawerWidth + 3 * 8;
  const OuterDrawerStyles = {
    width: newWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: newWidth,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
      overflow: "hidden",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    position: "fixed",
  };

  const getAllConnectedUsers = () => {
    const initialUser = { username: user?.username, profilePic: user?.profilePicture };
    const users = new Map<string, any>();
    //if the current user username is not in the list of users connected in all rooms in the current course, add it
    if (!users.has(initialUser.username)) {
      users.set(initialUser.username, initialUser);
    }
    currentCourse?.rooms.forEach((room) => {
      room.connected.forEach((connectedUser) => {
        users.set(connectedUser.username, { username: connectedUser.username, profilePic: connectedUser.profilePic });
      });
    });
    return Array.from(users.values()).sort((a, b) => a.username.localeCompare(b.username));
  };

  const OnlineUser = ({ user }) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar src={user.profilePic} />
        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "black" }}>
          <Typography sx={{ ml: 1, "&:hover": { cursor: "pointer", backgroundColor: "lightgrey" } }}>{user.username}</Typography>
        </Link>
      </Box>
    );
  };

  return (
    // <Box>
      <Drawer sx={OuterDrawerStyles} anchor="right" variant="permanent">
        <Box sx={{ display: "block", mt: `${appBarHeight}px`, p: 1 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Online Users
          </Typography>
          {getAllConnectedUsers().map((user) => (
            <Box key={user.username} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <OnlineUser user={user} />
            </Box>
          ))}
        </Box>
      </Drawer>
    // </Box> 
  );
};

export default UserBar;
