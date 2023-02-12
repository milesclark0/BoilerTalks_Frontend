import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Stepper, Step, StepLabel, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
    setLoading(true);
    // update database with new user
    fetch("http://127.0.0.1:5000/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(jsonData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        navigate("/home");
        setOpen(false);
        setLoading(false);
      });
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
