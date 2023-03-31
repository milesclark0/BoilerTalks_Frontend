import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, Typography } from "@mui/material";
import { useAuth } from "../../../../context/context";
import { Course, Room } from "../../../../types/types";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { getCourseManagementURL, removeReportURL } from "../../../../API/CourseManagementAPI";
import { useQuery } from "react-query";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';

type ViewReportProps = {
  ReportsList: {username: string, reason: string}[];
  ReportsOpen: boolean;
  setReportsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReportsList: React.Dispatch<React.SetStateAction<{username: string, reason: string}[]>>;
  course: Course;
};

const ViewReportModal = ({ ReportsList, ReportsOpen, setReportsList, setReportsOpen, course}: ViewReportProps) => {
  const api = useAxiosPrivate();

  const handleCloseReports = () => {
    setReportsOpen(false);
  };

  const handleRemoveReport = async (reportIndex: number) => {
    const reportlist = ReportsList;
    reportlist?.splice(reportIndex, 1);
    setReportsList(reportlist);
    await RemoveReport(reportIndex);//update backend
  };

  const { isLoading, error, data } = useQuery(["course_mngmt", course?._id.$oid], () => api.get(getCourseManagementURL + course?._id.$oid), {
    onSuccess: (data) => {
      console.log(data.data.data);
      setReportsList(data.data.data.reports);
    },
  });

  const RemoveReport = async (reportIndex: number) => {
    //fetch course management api
    const res = await api.post(removeReportURL + course?._id.$oid, {
      ...ReportsList[reportIndex]
    });
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
    } else {
      console.log(res.data.message);
    }
    setReportsOpen(false);
  };

  if (isLoading) {
    return null;
  }
  const ReportEntry = ({
    report,
    index,
  }: {
    report: {username: string, reason: string};
    index: number;
  }) => {
    return (
      <Stack direction="row" spacing={1}>
        <Typography
          sx={{
            width: 500,
            display: "flex",
          }}
          >{report.reason}
        </Typography>
        <IconButton aria-label="delete" onClick={() => handleRemoveReport(index)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    );
  };
  return (
    <Dialog open={ReportsOpen} onClose={handleCloseReports}>
      <Box component={"form"}>
        <DialogTitle>Reports</DialogTitle>
        <DialogContent>
          <DialogContentText>Reports for this course discussion:</DialogContentText>
          {ReportsList?.map((report, index) => {
            return (
              <Box key={index}>
                <ReportEntry report={report} index={index} key={index} />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReports}>Cancel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};


export default ViewReportModal;
