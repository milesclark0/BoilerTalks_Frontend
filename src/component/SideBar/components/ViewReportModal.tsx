import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getCourseManagementURL, removeReportURL } from "../../../API/CourseManagementAPI";
import { useQuery } from "react-query";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

type ViewReportProps = {
  ReportsList: {id: string, username: string; reason: string, body: string, numBans: number, numWarns: number }[];
  PrevBanList: { username: string; reason: string }[];
  PrevWarnList: { username: string; reason: string }[];  
  ViewReportsOpen: boolean;
  setViewReportsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReportsList: React.Dispatch<React.SetStateAction<{id: string; username: string; reason: string; body: string; numBans: number; numWarns: number}[]>>;
  setPrevBanList: React.Dispatch<React.SetStateAction<{ username: string; reason: string }[]>>;
  setPrevWarnList: React.Dispatch<React.SetStateAction<{ username: string; reason: string }[]>>;
  course: Course;
};

const ViewReportModal = ({ ReportsList, PrevBanList, PrevWarnList, ViewReportsOpen, setReportsList, setPrevBanList, setPrevWarnList, setViewReportsOpen, course }: ViewReportProps) => {
  const api = useAxiosPrivate();

  const handleCloseReports = () => {
    setViewReportsOpen(false);
  };

  const handleRemoveReport = async (reportID: string) => {
    const reportlist = ReportsList;
    const index = ReportsList.findIndex((report) => report.id === reportID);
    reportlist?.splice(index, 1);
    setReportsList(reportlist);
    await RemoveReport(index); //update backend
  };

  const reportListKeys = ["id", "username", "reason", "body", "numBans", "numWarns", "recipient"];
  const { isLoading, error, data } = useQuery(["course_mngmt", course?._id.$oid], () => api.get(getCourseManagementURL + course?._id.$oid), {
    onSuccess: (data) => {
      console.log(data.data.data);

      setPrevBanList(data.data.data.prevBannedUsers);
      setPrevWarnList(data.data.data.prevWarnedUsers);

      var rawReports: {id: string; username: string; reason: string; body: string; numBans: number, numWarns: number}[] = data.data.data.reports;

      console.log("Reports: " + rawReports[0].username);

      // tally the number of bans and warnings for the reported user in this course
      var reportsWithTallies: {id: string; username: string; reason: string; body: string; numBans: number, numWarns: number }[] = [];

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

        reportsWithTallies.push({id: report.id, username: report.username, reason: report.reason, body: report.body, numBans: banTally, numWarns: warnTally});
      }

      console.log("Reports with tallies: " + reportsWithTallies[0].username);

      setReportsList(reportsWithTallies);
    },
  });
  const [reportStateText, setReportStateText] = useState("Unsorted"); //What the sorted name string is
  const handleClickSort = () => {
    if(reportStateText === "Unsorted")
      {
        setReportStateText("Reason");
        ReportsList.sort(function(a, b){
          let x = a.reason.toLowerCase();
          let y = b.reason.toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
        }); 
      }
    else if(reportStateText === "Reason")
      {
        setReportStateText("Username");
        ReportsList.sort(function(a, b){
          let x = a.username.toLowerCase();
          let y = b.username.toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
        }); 
      }
    else
      {
        setReportStateText("Unsorted");
        //ReportsList.sort(function(a, b){return a.index - b.index});\
        ReportsList.reverse();
      }
  };
  
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
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'reason', headerName: 'First name', width: 130 },
    { field: 'body', headerName: 'Last name', width: 130 },
    { field: 'numBans', headerName: 'Bans', width: 130 },
    { field: 'numWarns', headerName: 'Warns', width: 130 },
  ];

  return (
    <Dialog open={ViewReportsOpen} onClose={handleCloseReports} fullWidth maxWidth="md" >
      <Box component={"form"} 
        sx={
          {
         
          
          }
        }
      >
        <DialogTitle>Reports</DialogTitle>
        <DialogContent>
            <Box 
              sx={
                {
                width:"100%",
                }
              }>
            
            <Box>Sort By: <Button variant="outlined" onClick={handleClickSort}>{reportStateText}</Button></Box>
            <Table  sx={{ width:"40%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {reportListKeys.map((key) => (
                  <TableCell>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ReportsList.map((report) => (
                <TableRow
                  key={report.id}
                  sx={{ '&:last-child td, &:last-child th': {  border: 0 } }}
                >
                  {reportListKeys.map((key) => (
                  <TableCell>{report[key]}</TableCell>
                  ))}
                  <IconButton onClick={() => handleRemoveReport(report["id"])}><DeleteIcon/></IconButton>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Box>       
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReports}>Cancel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ViewReportModal;
