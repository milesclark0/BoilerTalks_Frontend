import { Select, MenuItem } from "@mui/material";
import React from "react";
import { Course, Room } from "../../../globals/types";
import useStore from "../../../store/store";

type Props = {
};
export const SemesterSelector = () => {
  const [currentSemester, setCurrentSemester] = React.useState<string | null>(null);
  const [currentCourse, setCurrentCourse, setCurrentRoom, userCourseList, userRoomsList] = useStore((state) => [
    state.currentCourse,
    state.setCurrentCourse,
    state.setCurrentRoom,
    state.userCourseList,
    state.userRoomsList,
  ]);

  // returns the most recent semester for a given course
  const getMostRecentSemester = (courses: Course[]) => {
    if (!courses) return [];
    
    courses = courses?.filter((course) => course.name === currentCourse?.name);

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

  const isCourseSelected = () => {
    return currentCourse !== null;
  };

  const getCoursesByName = (courseName: string) => {
    const courses = userCourseList?.filter((course) => course.name === courseName);
    return courses ? courses : [];
  };

  return isCourseSelected() ? (
    <Select
      size="small"
      value={currentSemester || getMostRecentSemester(userCourseList)}
      onChange={(e) => {
        setCurrentSemester(e.target.value as string);
        const course = userCourseList?.find((course) => course.name === currentCourse.name && course.semester === e.target.value);
        if (course) {
          setCurrentCourse(course);
          const room = userRoomsList?.find((room) => room._id.$oid === course.rooms[0][1]?.$oid);
          setCurrentRoom(room);
        }
      }}
      // removes border from box
      sx={{
        boxShadow: "none",
        ".MuiOutlinedInput-notchedOutline": { border: 0 },
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
  ) : null;
};
