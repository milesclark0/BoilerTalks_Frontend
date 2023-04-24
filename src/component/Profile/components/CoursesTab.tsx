import { Box, Grid, List, ListItem, Paper, Typography, styled } from "@mui/material";
import React, { useEffect } from "react";
import { useAuth } from "../../../context/context";
import { useStore } from "zustand";
import { Course } from "../../../globals/types";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getUserCoursesAndRoomsURL } from "../../../API/CoursesAPI";
import CourseCard from "./courseCard";

const CoursesTab = ({ viewedUser, profileInfo, currentUserCourses }) => {
  function getActiveCourses() {
    const activeCourses = currentUserCourses?.filter((course) => viewedUser?.activeCourses.includes(course.name));
    return activeCourses;
  }

  const ActiveCoursesList = () => {
    return (
      <List>
        {getActiveCourses().map((course) => {
          return (
            <ListItem key={course.name}>
              <CourseCard course={course} />
            </ListItem>
          );
        })}
        {viewedUser?.activeCourses.length === 0 && (
          <ListItem>
            <Typography color={"grey"}>None</Typography>
          </ListItem>
        )}
      </List>
    );
  };

  const PastCoursesList = () => {
    //get courses that arent active
    const allCourses = currentUserCourses;
    const activeCourses = getActiveCourses();
    //this includes works because the active courses are a subset of all courses
    const pastCourses = allCourses.filter((course) => !activeCourses.includes(course));

    return (
      <List>
        {pastCourses.map((course) => {
          return (
            <ListItem key={course.name}>
              <CourseCard course={course} />
            </ListItem>
          );
        })}
        {pastCourses.length === 0 && (
          <ListItem>
            <Typography color={"grey"}>None</Typography>
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "primary.main",
        borderRadius: "3%",
        
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={6} textAlign={"center"}>
          <Typography variant="h6">Active Courses</Typography>{" "}
          <Box
            sx={{
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              maxHeight: "52vh",
            }}
          >
            <ActiveCoursesList />
          </Box>
        </Grid>
        <Grid item xs={6} textAlign={"center"}>
          <Typography variant="h6">Past Courses</Typography>{" "}
          <Box
            sx={{
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              maxHeight: "53vh",
            }}
          >
            <PastCoursesList />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursesTab;
