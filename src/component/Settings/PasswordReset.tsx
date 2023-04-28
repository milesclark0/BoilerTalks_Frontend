import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import { Alert, Box, InputAdornment, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import WarningIcon from "@mui/icons-material/Warning";
import { ChangePasswordAPI } from "../../API/RegisterAPI";
import { LoadingButton } from "@mui/lab";

const PasswordReset = () => {
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
        //console.log(res);
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
      <Box onSubmit={tryResetPassword} component="form">
        <Stack direction={"row"} spacing={2} sx={{alignItems: "center", mt: 3}}>
          <TextField
            label="Password"
            type="password"
            id="password"
            size="small"
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
            size="small"
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
          <LoadingButton variant="contained" loading={loading} disabled={loading} sx={{ textTransform: "none", width: "60%" }} type="submit" color="success">
            Change Password
          </LoadingButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default PasswordReset;
