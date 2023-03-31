import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { Alert, AppBar, Box, Button, Drawer, FormHelperText, FormLabel, IconButton, InputAdornment, Paper, Stack, Toolbar, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import WarningIcon from "@mui/icons-material/Warning";
import { ChangePasswordAPI } from "../API/RegisterAPI";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

const PasswordReset = (e) => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccessful, setResetStatus] = useState(false);

  const tryResetPassword = async (e) => {
    //call api to create account and login then sign in
    e.preventDefault();
    setLoading(false);
    let missing = false;
    if (password !== confirmPassword || password === "" || confirmPassword === "") {
      setPasswordError(true);
      missing = true;
    }
    if (password == confirmPassword) {
      setPasswordError(false);
    }
    if (!missing) {
      try {
        const res = await ChangePasswordAPI(user?.username, password);
        console.log(res);
        if (res.data.statusCode === 200) {
          setResetStatus(true);
          setPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <Box>
      {resetSuccessful == true && (
        <Alert
          onClose={() => {
            setResetStatus(false);
          }}
          severity="success"
        >
          Successful Password Reset!
        </Alert>
      )}
      <Typography variant="h5">Password Reset</Typography>
      <Typography variant="body2">Passwords must contain one uppercase letter, one special character, and one numerical value.</Typography>
      <Box sx={{ display: "inline-flex", paddingTop: "10px" }} onSubmit={tryResetPassword} component="form">
        <TextField
          label="Password"
          type="password"
          id="password"
          value={password}
          inputProps={{ maxLength: 30 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          }}
          required
          error={passwordError}
          helperText={passwordError ? (password === "" ? "Password cannot be empty." : "Passwords do not match.") : ""}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          sx={{ width: "70%" }}
        />
        <TextField
          id="confpassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          inputProps={{ maxLength: 30 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          }}
          required
          error={passwordError}
          helperText={passwordError ? (password === "" ? "Password cannot be empty." : "Passwords do not match.") : ""}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError(false);
          }}
          sx={{ width: "70%" }}
        />
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={loading}
          sx={{ width: "60%", textTransform: "none", fontSize: 16, mt: 2 }}
          type="submit"
          color="success"
        >
          Change Password
        </LoadingButton>
      </Box>
    </Box>
  );
};

const Settings = () => {
  const { user } = useAuth();
  const api = useAxiosPrivate();

  const [settingsPage, setSettingsPage] = useState<string>("Password");

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
      <AppBar position="fixed" sx={{ width: `calc(100%)`, ml: `${drawerWidth}px`, height: appBarHeight, alignContent: "center" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ p: 4 }}>
            {"Settings"}
          </Typography>
          <Button sx={{ color: "white" }} onClick={navigateToHome}>
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
          <Button onClick={() => setSettingsPage("Password")} fullWidth sx={{ textTransform: "none" }}>
            <Typography variant="body1">Password</Typography>
          </Button>
        </Stack>
      </Drawer>
      <Box sx={{ marginTop: `${appBarHeight}px`, marginLeft: `${drawerWidth}px`, paddingTop: "40px", paddingLeft: "40px" }}>
        <PasswordReset />
      </Box>
    </Paper>
  );
};

export default Settings;
