import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography, Autocomplete, TextField, Grid } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/userBar";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
};

const AppealsDisplay = () => {
  const { user } = useAuth();
  const { userBarProps } = useOutletContext<{ userBarProps: Props }>();
  const axiosPrivate = useAxiosPrivate();
  const [fetchError, setFetchError] = useState("");
  // const [appeals, setAppeals] = useState([]);
  const appeals = [
    { user: "bob", response: "hello" },
    { user: "jeff", response: "test" },
  ];

  const fetchAppeals = async () => {
    // return await axiosPrivate.get(getUserCoursesURL + user?.username);
  };

  // const { isLoading, error, data } = useQuery("user_courses: " + user?.username, fetchAppeals, {
  //   enabled: true,
  //   refetchInterval: 1000 * 60 * 2, //2 minutes
  //   refetchOnMount: "always",
  //   onSuccess: (data) => {
  //     if (data.data.statusCode === 200) {

  //     } else setFetchError(data.data.data);
  //   },
  //   onError: (error: string) => console.log(error),
  // });

  const AppealBox = ({ appeal }: any) => {
    console.log(appeal);
    return (
      <Grid item key={appeal} m={2} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
    <Box>
      <Grid
        container
        // spacing={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "flex-start",
        }}
      >
        {appeals.map((appeal) => {
          return <AppealBox appeal={appeal} />;
        })}
      </Grid>
      <UserBar {...userBarProps} />
    </Box>
  );
};

export default AppealsDisplay;
