// This file is used to display the ban to the user
import React, { useState } from "react";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { useOutletContext, useParams } from "react-router-dom";
import { Course } from "../../types/types";
import { addAppealURL } from "../../API/CourseManagementAPI";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/context";
import { LoadingButton } from "@mui/lab";

type Props = {
  setSubmittedAppeal: React.Dispatch<React.SetStateAction<boolean>>;
};

const BanDialog = () => {
  const [submittedAppeal, setSubmittedAppeal] = useState<boolean>(false);
  // const { roomProps } = useOutletContext<{ roomProps: Props }>();
  const { user } = useAuth();
  const { courseId } = useParams();

  const AppealForm = ({setSubmittedAppeal}: Props) => {
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [responseError, setResponseError] = useState<boolean>(false);
    const [response, setResponse] = useState<string>("");
    const axiosPrivate = useAxiosPrivate();
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const sendAppeal = async () => {
      try {
        const res = await axiosPrivate.post(addAppealURL + courseId, {
          user: user,
          response: response,
        });
        if (res.status == 200) {
          if (res.data.statusCode == 200) {
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const submitAppeal = () => {
      setSubmitLoading(true);
      if (response.length === 0) {
        setResponseError(true);
        setSubmitLoading(false);
        return;
      }
      // sendAppeal();
      setSubmittedAppeal(true);
      setOpenForm(false);
      setSubmitLoading(false);
    };

    const openAppealForm = () => {
      setOpenForm(true);
    };

    const closeAppealForm = () => {
      setOpenForm(false);
    };

    return (
      <React.Fragment>
        <Button onClick={openAppealForm} variant="outlined">
          Open Appeal Form
        </Button>
        <Dialog open={openForm}>
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            {"Appeal your ban"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* get username and get reason for ban */}
              Please provide a reason for why you should be unbanned.
            </DialogContentText>
            <TextField
              id="reason"
              label="Reason"
              multiline
              rows={5}
              autoFocus
              fullWidth
              required
              onChange={(e) => {
                setResponse(e.target.value);
              }}
              error={responseError}
              inputProps={{ maxLength: 250 }}
              helperText={responseError ? "Please enter a reason." : ""}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAppealForm} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              onClick={submitAppeal}
              variant="contained"
              loading={submitLoading}
              disabled={submitLoading}
            >
              Submit
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        boxShadow: 8,
        borderRadius: 2,
        maxHeight: "60%",
        width: "50%",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", mt: 4 }}>
        <DangerousIcon sx={{ color: "red", mr: 2, width: 45, height: 45 }} />
        <Typography variant="h4">You have been banned!</Typography>
      </CardContent>
      {submittedAppeal && (
        <CardContent sx={{ display: "flex", justifyContent: "center", overflowY: "auto" }}>
          <Typography variant="h6" sx={{ textAlign: "center", wordBreak: "break-word" }}>
            Your appeal is under review. Check back here to see your decision once it has been
            processed.
          </Typography>
        </CardContent>
      )}
      {!submittedAppeal && (
        <CardContent sx={{ display: "flex", justifyContent: "center", overflowY: "auto" }}>
          <Typography variant="h6" sx={{ textAlign: "center", wordBreak: "break-word" }}>
            Naughty
          </Typography>
        </CardContent>
      )}
      {!submittedAppeal && (
        <CardActions sx={{ mb: 2 }}>
          <AppealForm setSubmittedAppeal={setSubmittedAppeal} />
        </CardActions>
      )}
    </Box>
  );
};

export default BanDialog;
