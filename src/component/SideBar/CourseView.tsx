import { List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Course, Room } from "../../globals/types";
import { CourseNavigation } from "./CourseNavigation";
import { StyledDivider } from "./components/StyledDivider";
import useStore from "../../store/store";
import TabBar from "../HomePage/components/TabBar";

export const CourseView = () => {
  // if no course is selected, show boilertalks home
  const [activeIcon, userCourseList, distinctCoursesByDepartment, setDistinctCoursesByDepartment] = useStore((state) => [
    state.activeIcon,
    state.userCourseList,
    state.distinctCoursesByDepartment,
    state.setDistinctCoursesByDepartment,
  ]);

  useEffect(() => {
    if (activeIcon.course !== "" && !activeIcon.isActiveCourse) {
      setDistinctCoursesByDepartment(getDistinctCoursesByDepartment(activeIcon.course));
    }
  }, [activeIcon]);

  // gets the distinct courses for a department
  const getDistinctCoursesByDepartment = (department: string) => {
    const courses = userCourseList?.filter((course) => course.name.split(" ")[0] === department);
    //distinct named courses
    const distinctCourses = new Map<string, Course>();
    courses?.forEach((course) => {
      if (!distinctCourses.has(course.name)) distinctCourses.set(course.name, course);
    });
    return [...distinctCourses.values()];
  };

  if (activeIcon.course === "") {
    return (
      <List sx={{ width: "100%" }}>
        <ListItem sx={{ justifyContent: "center" }}>
          <Typography variant="h6" noWrap component="div">
            BoilerTalks Home
          </Typography>
        </ListItem>
        <StyledDivider />
        {/* <TabBar/> */}
      </List>
    );
  }
  // if a course is selected, show course navigation
  if (activeIcon.isActiveCourse) {
    const currCourse = userCourseList?.find((course) => course.name === activeIcon.course);
    return <CourseNavigation course={currCourse} />;
  }
  // if a department is selected, show course list
  return (
    <List>
      <ListItem sx={{ justifyContent: "center" }}>
        <Typography variant="h6" noWrap component="div">
          {activeIcon.course} Courses
        </Typography>
      </ListItem>
      <StyledDivider />
      {distinctCoursesByDepartment?.map((course) => (
        <React.Fragment key={course.name + course.semester}>
          <CourseNavigation course={course} />
          <StyledDivider />
        </React.Fragment>
      ))}
    </List>
  );
};
