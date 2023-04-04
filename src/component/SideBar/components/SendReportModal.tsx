import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "@mui/material";
import { addReportURL } from "../../../API/CourseManagementAPI";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

type SendReportProps = {
  NewReportText: string;
  ReportsOpen: boolean;
  setReportsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewReportText: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
};

const SendReportModal = ({ setNewReportText, NewReportText, setReportsOpen, ReportsOpen, course: course }: SendReportProps) => {
  const api = useAxiosPrivate();

  const handleCloseNewReport = () => {
    setReportsOpen(false);
  };
  const { user } = useAuth();

  const handleSubmitNewReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //fetch course management api
    const res = await api.post(addReportURL + course?._id.$oid, {
      username: user?.username,
      reason: NewReportText,
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
          <DialogContentText>Specify what you would like to report to moderators.</DialogContentText>
          <TextField
            onChange={(e) => setNewReportText(e.target.value)}
            autoFocus
            margin="dense"
            id="newThreadName"
            label="Report Message"
            type="text"
            variant="outlined"
            fullWidth
          />
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
