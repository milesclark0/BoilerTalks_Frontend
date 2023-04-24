import { Drawer, Box, List, ListItem, ListItemText, Typography, Button, Avatar, Badge, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import ProfilePage from "./../../../pages/ProfilePage";
import { Navigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { APP_STYLES } from "../../../globals/globalStyles";
import useStore from "../../../store/store";

const UserBar = () => {
  const { user, profile } = useAuth();
  const [profilePicLastUpdated, setProfilePicLastUpdated] = useState<number>(Date.now());
  const [currentCourse, userRoomsList, courseUsers] = useStore((state) => [state.currentCourse, state.userRoomsList, state.courseUsers]);
  const {courseId, roomId} = useParams();
  const theme = useTheme();
  useEffect(() => {
    //update profile pic every 5 minutes
    const interval = setInterval(() => {
      setProfilePicLastUpdated(Date.now());
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  const newWidth = APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH + 3 * 8;
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
    const initialUser = { username: user?.username, profilePic: user?.profilePicture, displayName: profile?.displayName };
    const users = new Map<string, any>();
    //if the current user username is not in the list of users connected in all rooms in the current course, add it
    if (!users.has(initialUser.username)) {
      users.set(initialUser.username, initialUser);
    }
    const courseRooms = userRoomsList.filter((room) => room.courseId.$oid === courseId);
    courseRooms.forEach((room) => {
      room.connected.forEach((connectedUser) => {
        users.set(connectedUser.username, { username: connectedUser.username, profilePic: connectedUser.profilePic });
      });
    });
    
    return Array.from(users.values()).sort((a, b) => a.username.localeCompare(b.username));
  };

  const getAllDisconnectedUsers = () => {
    const connectedUsers = getAllConnectedUsers();
    const offlineUsers = courseUsers.filter((user) => !connectedUsers.some((connectedUser) => connectedUser.username === user.username));
    return offlineUsers.sort((a, b) => a.username.localeCompare(b.username));
  };

  const UserDisplay = ({ user, online }) => {
    const {themeSetting} = useAuth();
    const linkColor = themeSetting === "dark" ? "white" : "black";
    const hoverColor = theme.palette.secondary.main;
    return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Badge
          invisible={!online}
          color="success"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
          overlap="circular"
          sx={{ "& .MuiBadge-badge": { width: 10, height: 10 } }}
        >
          <Avatar src={user.profilePic + `?${profilePicLastUpdated}`} />
        </Badge>
        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: linkColor }}>
          <Typography sx={{ ml: 1, "&:hover": { cursor: "pointer", color: hoverColor } }} noWrap>
            {user.displayName || user.username}
          </Typography>
        </Link>
      </Box>
    );
  };

  if (!courseId) return null;
  return (
    // <Box>
    <Drawer sx={OuterDrawerStyles} anchor="right" variant="permanent">
      <Box sx={{ display: "block", p:2 , pt: `${APP_STYLES.APP_BAR_HEIGHT + 4 * APP_STYLES.DEFAULT_PADDING}px`}}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Online - {getAllConnectedUsers().length}
        </Typography>
        {getAllConnectedUsers().map((user) => (
          <Box key={user.username} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <UserDisplay user={user} online={true} />
          </Box>
        ))}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Offline - {getAllDisconnectedUsers().length}
        </Typography>
        {getAllDisconnectedUsers().map((user) => (
          <Box key={user.username} sx={{ display: "flex", alignItems: "center", mb: 1, filter: "brightness(0.5)" }}>
            <UserDisplay user={user} online={false} />
          </Box>
        ))}
      </Box>
    </Drawer>
    // </Box>
  );
};

export default React.memo(UserBar);
