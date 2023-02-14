import React, { useState } from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { RegisterInfo } from "../../API/RegisterAPI";

const Information = ({ setOpen, setActiveStep }) => {
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    console.log(password);
    console.log(confirmPassword);
    setLoading(true);
    let missing = false;
    if (firstName === "") {
      setFirstNameError(true);
      missing = true;
    }
    if (lastName === "") {
      setLastNameError(true);
      missing = true;
    }
    if (username === "") {
      setUsernameError(true);
      missing = true;
    }
    if (password !== confirmPassword || password === "" || confirmPassword === "") {
      setPasswordError(true);
      missing = true;
    }

    if (!missing) {
      RegisterInfo(firstName, lastName, username, password)
        .then((res) => res.json())
        .then((data) => {
          // convert data to json
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    }
    setLoading(false);
  };

  const handleExit = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <Box>
      <Box>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          fullWidth
          required
          inputProps={{ maxLength: 15 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
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
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          }}
          error={lastNameError}
          helperText={lastNameError ? "Please enter a last name." : ""}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Username"
          fullWidth
          required
          error={usernameError}
          helperText={usernameError ? "Please a username." : ""}
          InputProps={{
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          }}
          id="email"
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
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" sx={{ mr: 1 }} onClick={handleExit}>
          Cancel
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <LoadingButton onClick={handleNext} variant="contained" loading={loading} disabled={loading}>
          Next
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default Information;
