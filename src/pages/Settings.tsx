import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { AppBar, Box, Button, Drawer, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

const Settings = () => {
  const { user } = useAuth();
  const api = useAxiosPrivate();

  const [settingsPage, setSettingsPage] = useState<string>("");

  const defaultPadding = 4;
  const drawerWidth = 200;
  const innerDrawerWidth = 85;
  const appBarHeight = 64;

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

  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/home");
  };

  return (
    <Paper sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100%)`,
          ml: `${drawerWidth}px`,
          height: appBarHeight,
          alignContent: "center",
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ p: 4 }}>
            {"Settings"}
          </Typography>
          {/* change color of this button based on dark mode/light mode */}
          <Button sx={{}} onClick={navigateToHome}>
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
        <Box
          sx={{
            display: "flex",
            paddingLeft: `${innerDrawerWidth}px`,
            paddingTop: `${appBarHeight}px`,
          }}
        ></Box>
        <Stack sx={{ alignItems: "center", paddingTop: "15px" }}>
          <Button
            component={NavLink}
            to="passwordReset"
            onClick={() => setSettingsPage("Password")}
            fullWidth
            sx={{ textTransform: "none" }}
          >
            <Typography variant="body1">Password</Typography>
          </Button>
          <Button
            component={NavLink}
            to="notificationPreference"
            onClick={() => setSettingsPage("NotificationPreference")}
            fullWidth
            sx={{ textTransform: "none" }}
          >
            <Typography variant="body1">Notification Preference</Typography>
          </Button>
        </Stack>
      </Drawer>
      <Box
        sx={{
          marginTop: `${appBarHeight}px`,
          marginLeft: `${drawerWidth}px`,
          paddingTop: "40px",
          paddingLeft: "40px",
        }}
      >
        {/* <PasswordReset /> */}
        <Outlet />
      </Box>
    </Paper>
  );
};

export default Settings;
