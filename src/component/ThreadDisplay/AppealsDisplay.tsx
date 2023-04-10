// Display for appeals
import { useState, useEffect } from "react";
import { Box, Typography, Grid, CardContent, CardActions, TextField } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../globals/types";
import { useParams } from "react-router-dom";
import UserBar from "../HomePage/components/userBar";
import { getCourseManagementURL } from "../../API/CourseManagementAPI";
import { LoadingButton } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { updateAppealURL } from "../../API/CourseManagementAPI";
import { APP_STYLES } from "../../globals/globalStyles";
import useStore from "../../store/store";
import CourseDisplayAppBar from "./CourseDisplayAppBar";
import { updateLastSeenAppealURL } from "../../API/ProfileAPI";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  defaultPadding: number;
  courseUsers: any[];
};

type Appeal = {
  username: string;
  response: string;
  reason: string;
  reviewed: boolean;
  unban: boolean;
};

const AppealsDisplay = () => {
  const axiosPrivate = useAxiosPrivate();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const { courseId } = useParams();
  const [stateChange, setStateChange] = useState<boolean>(false);
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const {user} = useAuth();

  const updateLastSeenAppeal = async () => {
    try {
      const res = await axiosPrivate.post(updateLastSeenAppealURL + user?.username, {
        courseName: currentCourse.name,
        id: appeals[appeals.length - 1]["id"],
      });
      console.log(res)
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          // do nothing
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setAppeals(res.data.data.appeals);
        }
      }
    };
    fetchCourseManagement();
  }, [currentCourse, stateChange]);

  useEffect(() => {
    if (appeals[appeals.length - 1] != undefined) {
      updateLastSeenAppeal();
    }
  }, [appeals]);

  const AppealBox = ({ appeal }) => {
    const [decisionLoading, setDecisionLoading] = useState<boolean>(false);

    const updateAppeal = async (decision) => {
      try {
        const res = await axiosPrivate.post(updateAppealURL + courseId, {
          username: appeal?.username,
          response: appeal?.response,
          reason: appeal?.reason,
          reviewed: true,
          unban: decision,
        });
        console.log(res);
        if (res.status == 200) {
          if (res.data.statusCode == 200) {
            setDecisionLoading(false);
            setStateChange(!stateChange);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const appealDecision = (e) => {
      setDecisionLoading(true);
      if (e.target.innerText === "UNBAN") {
        updateAppeal(true);
      } else {
        updateAppeal(false);
      }
    };

    return (
      <Grid item m={2} xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: 8,
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography variant="h5">'{appeal?.username}'</Typography>
          </CardContent>
          <CardContent sx={{ width: "80%" }}>
            <TextField
              sx={{
                width: "100%",
              }}
              multiline
              label="Ban Reason"
              value={appeal?.reason}
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
            />
          </CardContent>
          <CardContent sx={{ width: "80%" }}>
            <TextField
              sx={{
                width: "100%",
              }}
              multiline
              label="User Appeal"
              value={appeal?.response}
              rows={6}
              InputProps={{
                readOnly: true,
              }}
            />
          </CardContent>
          {appeal?.reviewed ? (
            <Typography sx={{ mb: 2 }}>{appeal?.unban ? "Decision: Accepted" : "Decision: Denied"}</Typography>
          ) : (
            <CardActions sx={{ mb: 2 }}>
              <LoadingButton variant="contained" startIcon={<CloseIcon />} color="error" loading={decisionLoading} onClick={appealDecision}>
                Deny
              </LoadingButton>
              <LoadingButton variant="contained" startIcon={<CheckIcon />} color="success" loading={decisionLoading} onClick={appealDecision}>
                Unban
              </LoadingButton>
            </CardActions>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        p: APP_STYLES.DEFAULT_PADDING,
        width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end"
      }}
      className="scrollBar"
    >
      <CourseDisplayAppBar/>
      {appeals.length !== 0 ? (
        <Grid container sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          {appeals.map((appeal, index) => {
            return <AppealBox key={index} appeal={appeal} />;
          })}
        </Grid>
      ) : (
        <Typography variant="h6">There are currently no appeals.</Typography>
      )}
      <UserBar />
    </Box>
  );
};

export default AppealsDisplay;
