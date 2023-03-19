import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CardContent,
  CardActions,
} from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/userBar";
import { getCourseManagementURL } from "../../API/CoursesAPI";
import { LoadingButton } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  defaultPadding: number;
};

const AppealsDisplay = () => {
  const { user } = useAuth();
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
    const fetchCourseAppeals = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          // setAppeals(res.data.data);
        }
      }
    };
    if (roomProps.currentCourse) {
      fetchCourseAppeals();
    }
  }, [roomProps.currentCourse]);

  const AppealBox = ({ appeal }) => {
    const [decisionLoading, setDecisionLoading] = useState<boolean>(false);
    // console.log(appeal);

    const appealDecision = (e) => {
      setDecisionLoading(true);
      if (e.target.innerText === "Unban") {

      } else {

      }
      // setDecisionLoading(false);
    };

    return (
      <Grid
        item
        key={appeal.user}
        m={2}
        xs={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          key={appeal.user}
          sx={{
            width: "100%",
            minHeight: 250,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            boxShadow: 8,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Typography>user: {appeal.user}</Typography>
            <Typography>ban reason: naughty</Typography>
            <Typography>user appeal: {appeal.response}</Typography>
            <Typography>appeal decision: unknown</Typography>
          </CardContent>
          <CardActions sx={{ mb: 2 }}>
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
          {appeals.map((appeal) => {
            return <AppealBox appeal={appeal} />;
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
