import { List, ListItem, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { Course } from "../../../types/types";
import AddThreadModal from "./CourseNavigation/addThreadModal";
import { MoreIcon } from "./CourseNavigation/MoreIcon";
import { PinIcon } from "./CourseNavigation/PinIcon";
import RulesModal from "./CourseNavigation/RulesModal";
import { StyledDivider } from "../StyledDivider";

type Props = {
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  distinctDepartments: string[];
  distinctCoursesByDepartment: Course[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  newThreadOpen: boolean;
  setNewThreadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newThreadValue: string;
  setNewThreadValue: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
};

export const CourseNavigation = ({ course, ...props }: Props) => {
  const [RulesOpen, setRulesOpen] = useState(false); //whether the rules dialogue is open or not
  const [RulesText, setRulesText] = useState(""); //import backend rules text

  const MoreIconProps = {
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
    setDistinctDepartments: props.setDistinctDepartments,
    distinctDepartments: props.distinctDepartments,
    setActiveIcon: props.setActiveIcon,
    activeIcon: props.activeIcon,
    course: course,
    distinctCoursesByDepartment: props.distinctCoursesByDepartment,
  };

  const CreateNewThreadProps = {
    newThreadOpen: props.newThreadOpen,
    newThreadValue: props.newThreadValue,
    setNewThreadOpen: props.setNewThreadOpen,
    setNewThreadValue: props.setNewThreadValue,
    currentCourse: props.currentCourse,
    setCurrentCourse: props.setCurrentCourse,
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
  };

  const RulesProps = {
    RulesText,
    RulesOpen,
    setRulesOpen,
    setRulesText,
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
    course: course,
  };

  const handleClickRules = () => {
    setRulesOpen(true);
  };

  const handleClickNewThread = () => {
    props.setNewThreadOpen(true);
  };

  return (
    <List>
      <ListItem>
        <Typography variant="body1" noWrap component="div">
          {course?.name}
        </Typography>
        <PinIcon course={course} />
        <MoreIcon course={course} {...MoreIconProps} />
      </ListItem>
      <StyledDivider />
      <ListItem>
        <List>
          <Button
            sx={{
              width: "100%",
            }}
          >
            <ListItem>
              <Typography variant="body2" noWrap component="div">
                Q&A
              </Typography>
            </ListItem>
          </Button>
          {course?.rooms?.map((room) => {
            return (
              <React.Fragment key={`${course.name}: ${room?.name}`}>
                <Button
                  sx={{
                    width: "100%",
                  }}
                >
                  <ListItem>
                    <Typography variant="body2" noWrap>
                      {room?.name?.replace(course?.name, "")}
                    </Typography>
                  </ListItem>
                </Button>
              </React.Fragment>
            );
          })}
          {/* <ListItem>
                <Typography variant="body1" noWrap component="div">
                  Mod Chat
                </Typography>
              </ListItem> */}
          <Button variant="text" onClick={handleClickRules}>
            <ListItem>
              <Typography variant="body2">Rules</Typography>
            </ListItem>
          </Button>
          <Button variant="outlined" onClick={handleClickNewThread}>
            <ListItem>
              <Typography variant="body2">New thread</Typography>
            </ListItem>
          </Button>
          <AddThreadModal course={course} {...CreateNewThreadProps} />
          <RulesModal {...RulesProps} />
        </List>
      </ListItem>
    </List>
  );
};
