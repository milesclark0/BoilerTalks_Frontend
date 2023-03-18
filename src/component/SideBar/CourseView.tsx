import { List, ListItem, Typography } from "@mui/material";
import React from "react";
import { Course, Room } from "../../types/types";
import { CourseNavigation } from "./CourseView/CourseNavigation";
import { StyledDivider } from "./StyledDivider";

type Props = {
  activeIcon: { course: string; isActiveCourse: boolean };
  distinctCoursesByDepartment: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  newThreadOpen: boolean;
  setNewThreadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newThreadValue: string;
  setNewThreadValue: React.Dispatch<React.SetStateAction<string>>;
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  distinctDepartments: string[];
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
};

export const CourseView = ({ ...props }: Props) => {
  // if no course is selected, show boilertalks home
  const { activeIcon, currentCourse, distinctCoursesByDepartment } = props;

  const CourseNavigationProps = {
    ...props,
  };

  if (activeIcon.course === "") {
    return (
      <List sx={{ width: "100%" }}>
        <ListItem sx={{ justifyContent: "center"}}>
          <Typography variant="h6" noWrap component="div">
            BoilerTalks Home
          </Typography>
        </ListItem>
        <StyledDivider />
      </List>
    );
  }
  // if a course is selected, show course navigation
  if (activeIcon.isActiveCourse) {
    return <CourseNavigation course={currentCourse} {...CourseNavigationProps} />;
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
          <CourseNavigation course={course} {...CourseNavigationProps} />
          <StyledDivider />
        </React.Fragment>
      ))}
    </List>
  );
};
