import React, { useState } from "react";
import { Box, Button, Typography, TextField, Divider, InputAdornment } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Warning } from "@mui/icons-material";

import LoadingButton from "@mui/lab/LoadingButton";
import { LoginAPI } from "../API/AuthAPI";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/context";
import { RegisterAccountAPI } from "../API/RegisterAPI";

const Register = () => {
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  
  const logIn = () => {
    navigate("/login");
  };

  const createAccount = async () => {
    //call api to create account and login then sign in
    setLoading(true);
    try {
      const res = await RegisterAccountAPI(username, password, lastName, firstName, email);
      if (res.data.statusCode === 200) {
        console.log(res);
        // set login context and navigate to home page
        navigate("/chooseThreads");
        // const loginResponse = await LoginAPI(username, password);
        // if (loginResponse.data.statusCode === 200) {
        //   signIn({ username: username });
        // } else {
        //   setError(loginResponse.data.message);
        // }
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
          height: "75%",
          width: "55%",
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
        onSubmit={createAccount}
      >
        <Typography variant="h4">Sign up now!</Typography>
        <Box sx={{ width: "70%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            required
            inputProps={{ maxLength: 15 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{firstNameError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            error={firstNameError}
            helperText={firstNameError ? "Please enter a first name." : ""}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mt: 3 }}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            required
            inputProps={{ maxLength: 15 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{lastNameError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            error={lastNameError}
            helperText={lastNameError ? "Please enter a last name." : ""}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            required
            error={emailError}
            helperText={emailError ? "Please enter an email." : ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">{emailError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            required
            error={usernameError}
            helperText={usernameError ? "Please enter a username." : ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">{usernameError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            inputProps={{ maxLength: 30 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            fullWidth
            required
            error={passwordError}
            helperText={passwordError ? (password === "" ? "Password cannot be empty." : "Passwords do not match.") : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            inputProps={{ maxLength: 30 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
            }}
            required
            error={passwordError}
            helperText={passwordError ? (password === "" ? "Password cannot be empty." : "Passwords do not match.") : ""}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            disabled={loading}
            sx={{ width: "60%", textTransform: "none", fontSize: 16, mt: 2 }}
            type="submit"
            color="success"
          >
            Create Account
          </LoadingButton>
          <Divider sx={{ width: "80%", mt: 2, mb: 2 }} />
          <Typography variant="body1">Already have an account?</Typography>
          <Button
            variant="contained"
            onClick={logIn}
            sx={{
              width: "40%",
              textTransform: "none",
              fontSize: 16,
              mt: 2
            }}
          >
            Back to Log In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
