import React, { useState } from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import LoadingButton from "@mui/lab/LoadingButton";

const Register = ({ open, setOpen, setAuth, setUserName }) => {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  const createAccount = () => {
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
    console.log(email.split("@")[1]);
    if (email === "" || email.split("@")[1] !== "purdue.edu" || email.split("@")[1] === undefined) {
      setEmailError(true);
      missing = true;
    }
    if (password !== confirmPassword || password === "" || confirmPassword === "") {
      setPasswordError(true);
      missing = true;
    }

    if (!missing) {
      setOpen(false);
      var puid = email.split("@")[0];
      setUserName(puid);
      var jsonData = {
        firstName: firstName,
        lastName: lastName,
        puid: puid,
        password: password,
      };
    //   jsonData = '"' + JSON.stringify(jsonData).replaceAll('"', '\\"') + '"';
    } else {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Sign Up
        <IconButton sx={{ float: "right" }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
          },
        }}
      >
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
          error={emailError}
          helperText={emailError ? "Please a username." : ""}
          InputProps={{
            endAdornment: <InputAdornment position="end">{passwordError ? <WarningIcon sx={{ color: "red" }} /> : ""}</InputAdornment>,
          }}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
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
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={loading}
          onClick={createAccount}
          color="success"
          // sx={{ backgroundColor: "green", color: "white" }}
        >
          Create New Account
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Register;
