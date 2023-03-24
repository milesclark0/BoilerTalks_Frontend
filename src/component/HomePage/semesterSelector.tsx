import { Select, MenuItem } from "@mui/material";
import React from "react";
import { Course, Room } from "../../types/types";

type Props = {
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  isCourseSelected: () => boolean;
  userCourses: Course[];
};
export const SemesterSelector = ({currentCourse, setCurrentCourse, setCurrentRoom, isCourseSelected, userCourses}: Props) => {
  const [currentSemester, setCurrentSemester] = React.useState<string | null>(null);

  // returns the most recent semester for a given course
  const getMostRecentSemester = (courses: Course[]) => {
    courses = courses.filter((course) => course.name === currentCourse?.name);

    //sort courses by semester ex Winter 2021 < Spring 2021 < Summer 2021  < Fall 2021
    const sortedCourses = [...courses].sort((a, b) => {
      const [aSeason, aYear] = a.semester.split(" ");
      const [bSeason, bYear] = b.semester.split(" ");
      if (aYear > bYear) return -1;
      else if (aYear < bYear) return 1;
      else {
        if (aSeason === "Winter") return -1;
        else if (aSeason === "Spring") {
          if (bSeason === "Winter") return 1;
          else return -1;
        } else if (aSeason === "Summer") {
          if (bSeason === "Fall") return -1;
          else return 1;
        } else return 1;
      }
    });

    return sortedCourses[0]?.semester;
  };

  const getCoursesByName = (courseName: string) => {
    const courses = userCourses?.filter((course) => course.name === courseName);
    return courses;
  };

    return (
    isCourseSelected() ? (
        <Select
          size="small"
          value={currentSemester || getMostRecentSemester(userCourses)}
          onChange={(e) => {
            setCurrentSemester(e.target.value as string);
            const course = userCourses.find((course) => course.name === currentCourse.name && course.semester === e.target.value);
            if (course) {
              setCurrentCourse(course);
              setCurrentRoom(course.rooms[0]);
            }
          }}
          // removes border from box
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            color: "white",
          }}
        >
          <MenuItem disabled value="">
            Select Semester
          </MenuItem>
          {getCoursesByName(currentCourse?.name).map((course) => (
            <MenuItem key={course.semester} value={course.semester}>
              {course.semester}
            </MenuItem>
          ))}
        </Select>
      ) : null
    );
};
