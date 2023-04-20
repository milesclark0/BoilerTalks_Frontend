import { Box, Grid, List, ListItem, Paper, Typography, styled } from "@mui/material";
import React from "react";
import { useAuth } from "../../../context/context";

const CoursesTab = ({ viewedUser, profileInfo }) => {
  const ActiveCoursesList = () => {
    return (
      <List>
        {viewedUser?.activeCourses.map((course) => {
          return (
            <ListItem key={course}>
              <Typography>{course}</Typography>
            </ListItem>
          );
        })}
        {viewedUser?.activeCourses.length === 0 && (
          <ListItem>
            <Typography>None</Typography>
          </ListItem>
        )}
      </List>
    );
  };

  const PastCoursesList = () => {
    //get courses that arent active
    const allCourses = viewedUser?.courses;
    const activeCourses = viewedUser?.activeCourses;
    const pastCourses = allCourses.filter((course) => !activeCourses.includes(course));

    return (
      <List>
        {pastCourses.map((course) => {
          return (
            <ListItem key={course}>
              <Typography>{course}</Typography>
            </ListItem>
          );
        })}
        {pastCourses.length === 0 && (
          <ListItem>
            <Typography>None</Typography>
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={6} textAlign={"center"}>
        <Typography>Active Courses</Typography>{" "}
        <Box
          sx={{
            overflowY: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ActiveCoursesList />
        </Box>
      </Grid>
      <Grid item xs={6} textAlign={"center"}>
        <Typography>Past Courses</Typography>{" "}
        <Box
          sx={{
            overflowY: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <PastCoursesList />
        </Box>
      </Grid>
    </Grid>
  );
};

export default CoursesTab;
