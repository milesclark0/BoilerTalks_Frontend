import { useState, useEffect } from "react";
import { Box, Typography, Grid, CardContent, CardActions, TextField } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../types/types";
import { useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/userBar";
import { getCourseManagementURL } from "../../API/CourseManagementAPI";
import { LoadingButton } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { updateAppealURL } from "../../API/CourseManagementAPI";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  defaultPadding: number;
};

const AppealsDisplay = () => {
  // const { user } = useAuth();
  const { roomProps } = useOutletContext<{ roomProps: Props }>();
  const axiosPrivate = useAxiosPrivate();
  // const [appeals, setAppeals] = useState([]);
  const { courseId } = useParams();
  const appeals = [
    { user: "bob", response: "hello" },
    { user: "jeff", response: "test" },
    { user: "jay", response: "idk" },
    { user: "who", response: "what" },
    { user: "else", response: "where" },
  ];

  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          // setAppeals(res.data.data);
        }
      }
    };
    if (roomProps.currentCourse) {
      fetchCourseManagement();
    }
  }, [roomProps.currentCourse]);

  const AppealBox = ({ appeal, index }) => {
    const [decisionLoading, setDecisionLoading] = useState<boolean>(false);
    // console.log(appeal);

    const updateAppeal = async (e) => {
      try {
        const res = await axiosPrivate.post(updateAppealURL + courseId, {
          descision: e.target.innerText,
        });
        if (res.status == 200) {
          if (res.data.statusCode == 200) {
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const appealDecision = (e) => {
      setDecisionLoading(true);
      // updateAppeal(e);
      setDecisionLoading(false);
    };

    return (
      <Grid
        item
        key={index}
        m={2}
        xs={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          key={index}
          sx={{
            width: "100%",
            // minHeight: 250,
            // maxHeight: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: 8,
            // justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography>user: {appeal.user}</Typography>
          </CardContent>
          <CardContent sx={{ width: "80%" }}>
            {/* <Typography sx={{ wordBreak: "break-word", textAlign: "center" }}>
              ban reason: naughty
            </Typography> */}
            <TextField
              sx={{
                width: "100%",
              }}
              multiline
              label="Ban Reason"
              value="naughty"
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
            />
          </CardContent>
          <CardContent sx={{ width: "80%" }}>
            {/* <Typography sx={{ wordBreak: "break-word", textAlign: "center" }}>
              user appeal: naughty
            </Typography> */}
            <TextField
              sx={{
                width: "100%",
              }}
              multiline
              label="User Appeal"
              value="naughty"
              rows={6}
              InputProps={{
                readOnly: true,
              }}
            />
          </CardContent>
          <CardActions>
            <LoadingButton
              variant="contained"
              startIcon={<CloseIcon />}
              color="error"
              loading={decisionLoading}
              // disabled={}
              onClick={appealDecision}
            >
              Deny
            </LoadingButton>
            <LoadingButton
              variant="contained"
              startIcon={<CheckIcon />}
              color="success"
              loading={decisionLoading}
              // disabled={}
              onClick={appealDecision}
            >
              Unban
            </LoadingButton>
          </CardActions>
        </Box>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        p: roomProps.defaultPadding,
        width: `calc(100% - ${roomProps.drawerWidth}px)`,
        overflowY: "auto",
        // display: "flex",
        // flexDirection: "column-reverse"
      }}
      className="scrollBar"
    >
      {appeals.length !== 0 ? (
        <Grid
          container
          // spacing={0}
          sx={{ display: "flex", justifyContent: "center", mb: 6 }}
        >
          {appeals.map((appeal, index) => {
            return <AppealBox appeal={appeal} index={index}/>;
          })}
        </Grid>
      ) : (
        <Typography variant="h6">There are currently no appeals.</Typography>
      )}
      <UserBar {...roomProps} />
    </Box>
  );
};

export default AppealsDisplay;
