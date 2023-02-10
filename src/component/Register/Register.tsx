import React, { useState, useEffect } from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment } from "@mui/material";
import { Button, Stepper, Step, StepLabel, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import LoadingButton from "@mui/lab/LoadingButton";
import Information from "./Information";
import JoinThreads from "./JoinThreads";

const Register = ({ open, setOpen, setAuth }) => {
  const navigate = useNavigate();
  const steps = ["Enter Information", "Choose threads to join"];
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  const handleExit = () => {
    setOpen(false);
    navigate("/auth/login")
  };

  const createAccount = () => {
    setAuth(true);
    navigate("/home")
    setOpen(false);
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  return (
    <Dialog open={open} onClose={handleExit}>
      <DialogTitle>{"Sign Up"}</DialogTitle>
      <DialogContent
        sx={{
          "& .MuiFormHelperText-root": {
            marginLeft: 0,
          },
        }}
      >
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            return (
              <Step key={label}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>All steps completed - you&apos;re finished</Typography>
            <Box sx={{ display: "flex",justifyContent:"center", alignItems:"center" }}>
              <LoadingButton variant="contained" loading={loading} disabled={loading} onClick={createAccount} color="success">
                Create New Account
              </LoadingButton>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 ? <Information setOpen={setOpen} setActiveStep={setActiveStep} /> : <JoinThreads setActiveStep={setActiveStep} />}
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Register;
