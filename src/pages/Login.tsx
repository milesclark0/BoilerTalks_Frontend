import React, { useState } from "react";
import { Box, Button, Typography, TextField, Divider, InputAdornment } from "@mui/material";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
// import Register from "../component/Register/Register";
import { Visibility, VisibilityOff, Warning } from "@mui/icons-material";

import LoadingButton from "@mui/lab/LoadingButton";
import { LoginAPI } from "../API/AuthAPI";
import { useAuth } from "../context/context";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(username, password);
    if (username === "" || password === "") {
      setError("Please enter all fields");
      return;
    }
    //call api to login and sign in
    try {
      const res = await LoginAPI(username, password);
      console.log(res);
      if (res.data.statusCode === 200) {
        // sign in (and navigate to home page)
        signIn({ username: username });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 8,
          height: "70%",
          width: "50%",
          borderRadius: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          "& > :not(style)": { m: 1 },
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <img src={logo} height={100} alt="logo" />
        <TextField
          label="Username"
          autoComplete="username"
          sx={{ width: "60%" }}
          error={error ? true : false}
          // InputProps={{
          //   endAdornment: <InputAdornment position="end">{error ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          // }}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
        <TextField
          label="Password"
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          error={error ? true : false}
          sx={{ width: "60%" }}
          helperText={error || ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <div onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</div>
              </InputAdornment>
            ),
            style: { cursor: "pointer" },
          }}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={loading}
          sx={{ width: "60%", textTransform: "none", fontSize: 16 }}
          type="submit"
        >
          Log In
        </LoadingButton>
        <Divider sx={{ width: "80%" }} />
        <Typography variant="body1">Don't have an account?</Typography>
        <Button
          variant="contained"
          onClick={navigateToRegister}
          sx={{
            width: "40%",
            textTransform: "none",
            fontSize: 16,
          }}
          color="success"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
