import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
  Grid,
} from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/userBar";
import { getCourseAppealsURL } from "../../API/CoursesAPI";

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
  const [appeals, setAppeals] = useState([]);
  const { courseId } = useParams();
  // const appeals = [
  //   { user: "bob", response: "hello" },
  //   { user: "jeff", response: "test" },
  // ];

  useEffect(() => {
    const fetchCourseAppeals = async () => {
      const res = await axiosPrivate.get(getCourseAppealsURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setAppeals(res.data.data);
        }
      }
    };
    if (roomProps.currentCourse) {
      fetchCourseAppeals();
    }
  }, [roomProps.currentCourse]);

  const AppealBox = ({ appeal }: any) => {
    console.log(appeal);
    return (
      <Grid
        item
        key={appeal}
        m={2}
        xs={12}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            // width: "80%",
            minHeight: 150,
            display: "flex",
            borderRadius: 2,
            boxShadow: 8,
          }}
        >
          <Typography>{appeal.user}</Typography>
        </Box>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        p: roomProps.defaultPadding,
        width: `calc(100% - ${roomProps.drawerWidth * 2}px)`,
        overflowY: "auto",
        display: "flex",
      }}
      className="scrollBar"
    >
      {appeals.length !== 0 ? (
        <Grid
          container
          // spacing={0}
          sx={{ display: "flex", justifyContent: "center" }}
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
