import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, Typography } from "@mui/material";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getCourseManagementURL, removeReportURL } from "../../../API/CourseManagementAPI";
import { useQuery } from "react-query";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";

type ViewReportProps = {
  ReportsList: { username: string; reason: string, numBans: number, numWarns: number }[];
  PrevBanList: { username: string; reason: string }[];
  PrevWarnList: { username: string; reason: string }[];  
  ViewReportsOpen: boolean;
  setViewReportsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReportsList: React.Dispatch<React.SetStateAction<{ username: string; reason: string }[]>>;
  setPrevBanList: React.Dispatch<React.SetStateAction<{ username: string; reason: string }[]>>;
  setPrevWarnList: React.Dispatch<React.SetStateAction<{ username: string; reason: string }[]>>;
  course: Course;
};

const ViewReportModal = ({ ReportsList, PrevBanList, PrevWarnList, ViewReportsOpen, setReportsList, setPrevBanList, setPrevWarnList, setViewReportsOpen, course }: ViewReportProps) => {
  const api = useAxiosPrivate();

  const handleCloseReports = () => {
    setViewReportsOpen(false);
  };

  const handleRemoveReport = async (reportIndex: number) => {
    const reportlist = ReportsList;
    reportlist?.splice(reportIndex, 1);
    setReportsList(reportlist);
    await RemoveReport(reportIndex); //update backend
  };

  const { isLoading, error, data } = useQuery(["course_mngmt", course?._id.$oid], () => api.get(getCourseManagementURL + course?._id.$oid), {
    onSuccess: (data) => {
      console.log(data.data.data);

      setPrevBanList(data.data.data.prevBannedUsers);
      setPrevWarnList(data.data.data.prevWarnedUsers);

      var rawReports: { username: string; reason: string }[] = data.data.data.reports;

      console.log("Reports: " + rawReports[0].username);

      // tally the number of bans and warnings for the reported user in this course
      var reportsWithTallies: { username: string; reason: string, numBans: number, numWarns: number }[] = [];

      const prevBanList = data.data.data.prevBannedUsers;
      const prevWarnList = data.data.data.prevWarnedUsers;

      for (var report of rawReports) {
        var banTally = 0;
        var warnTally = 0;

        for (var ban of prevBanList) {
          if (report.username === ban.username) {
            banTally++;
          }
        }

        for (var warn of prevWarnList) {
          if (report.username === warn.username) {
            warnTally++;
          }
        }

        reportsWithTallies.push({username: report.username, reason: report.reason, numBans: banTally, numWarns: warnTally});
      }

      console.log("Reports with tallies: " + reportsWithTallies[0].username);

      setReportsList(reportsWithTallies);
    },
  });

  const RemoveReport = async (reportIndex: number) => {
    //fetch course management api
    const res = await api.post(removeReportURL + course?._id.$oid, {
      ...ReportsList[reportIndex],
    });
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
    } else {
      console.log(res.data.message);
    }
    setViewReportsOpen(false);
  };

  if (isLoading) {
    return null;
  }
  const ReportEntry = ({ report, index }: { report: { username: string; reason: string, numBans: number, numWarns: number }; index: number }) => {
    return (
      <Stack direction="row" spacing={1}>
        <Typography
          sx={{
            width: 500,
            display: "flex",
          }}
        >
          {report.username + ": " + report.reason}
        </Typography>
        <Typography
          sx={{
            width: 550,
            display: "flex",
          }}
        >
          {"Times banned: " + report.numBans + "; Times warned: " + report.numWarns}
        </Typography>
        <IconButton aria-label="delete" onClick={() => handleRemoveReport(index)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    );
  };
  return (
    <Dialog open={ViewReportsOpen} onClose={handleCloseReports}>
      <Box component={"form"}>
        <DialogTitle>Reports</DialogTitle>
        <DialogContent>
          
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
