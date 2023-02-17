import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Stepper, Step, StepLabel, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Information from "./Information";
import JoinThreads from "./JoinThreads";
import { useAuth } from "../../context/context";
import { RegisterAccountAPI } from "../../API/RegisterAPI";
import { LoginAPI } from "../../API/AuthAPI";


const Register = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const steps = ["Enter Information", "Choose threads to join"];
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<{firstName: string, lastName: string, username: string, password: string, email: string}>(null);
  const [userCourses, setUserCourses] = useState(null);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  const handleExit = () => {
    setOpen(false);
    navigate("/login")
  };

  const finishAccount = async () => {
    //call api to create account and login then sign in
    try {
      const res = await RegisterAccountAPI(userInfo?.username, userInfo?.password, userInfo?.lastName, userInfo?.firstName, userInfo?.email);
      if (res.data.statusCode === 200) {
          console.log(res);
          // set login context and navigate to home page
          const loginResponse = await LoginAPI(userInfo?.username, userInfo?.password);
          if (loginResponse.data.statusCode === 200) {
            signIn(res.data.data.user);
          } else {
            setError(loginResponse.data.message);
          }
        } else {
          setError(res.data.message);
        }
    } catch (error) {
      console.log(error);
    }
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
              <Button variant="contained" onClick={finishAccount} color="success">
                Create New Account
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 ? <Information setOpen={setOpen} setActiveStep={setActiveStep} setUserInfo={setUserInfo} /> : <JoinThreads setActiveStep={setActiveStep} setUserCourses={setUserCourses} />}
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Register;
