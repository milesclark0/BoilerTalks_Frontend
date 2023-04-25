import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Box,
  Stack,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { addReportURL } from "../../../API/CourseManagementAPI";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

type SendReportProps = {
  ReportsOpen: boolean;
  setReportsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: Course;
  initialReason?: string;
  recipient?: string;
};

const SendReportModal = ({ setReportsOpen, ReportsOpen, course: course, initialReason, recipient }: SendReportProps) => {
  const api = useAxiosPrivate();
  const [reportBody, setReportBody] = useState("");
  const [reportReason, setReportReason] = useState(initialReason || "");
  const { user } = useAuth();

  const handleCloseNewReport = () => {
    setReportBody("");
    setReportReason("");
    setReportsOpen(false);
  };

  const validateInput = () => {
    if (reportReason === "") {
      alert("Please select a reason for your report.");
      return false;
    }
    if (reportBody === "") {
      alert("Please enter a report body.");
      return false;
    }
    return true;
  };

  const handleSubmitNewReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInput()) {
      return;
    }
    //fetch course management api
    const res = await api.post(addReportURL + course?._id.$oid, {
      id: uuidv4().toString(),
      username: user?.username,
      reason: reportReason,
      body: reportBody,
      recipient: recipient,
    });
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
    } else {
      console.log(res.data.message);
    }
    setReportsOpen(false);
  };

  return (
    <Dialog open={ReportsOpen} onClose={handleCloseNewReport}>
      <Box component={"form"} onSubmit={handleSubmitNewReport}>
        <DialogTitle>Send a new report</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>Specify what you would like to report to moderators.</Typography>
          <Stack spacing={1}>
            <TextField select sx={{ width: "10vw" }} label="Reason" size="small" onChange={(e) => setReportReason(e.target.value)} value={reportReason}>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
              <MenuItem value="Thread">Thread</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              onChange={(e) => setReportBody(e.target.value)}
              id="newThreadName"
              label="Report Body"
              type="text"
              variant="outlined"
              fullWidth
              multiline
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewReport}>Cancel</Button>
          <Button variant="outlined" type="submit">
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
export default SendReportModal;
