import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import { getUserCoursesURL, getCourseURL } from "../API/CoursesAPI";
import SideBar from "../component/HomePage/sideBar";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { Course } from "../types/types";

const Home = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [showCourses, setShowCourses] = useState(false);
  const [activeIcon, setActiveIcon] = useState<{ course: string; isActiveCourse: boolean }>({ course: "", isActiveCourse: false });
  //this value will hold the actual course data (all semesters included) for each user course
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentSemester, setCurrentSemester] = useState<string>("");
  const [fetchError, setFetchError] = useState("");

  const defaultPadding = 4;

  useEffect(() => {
    userCourses.forEach((course) => {
      if (activeIcon.isActiveCourse) {
        if (course.name === activeIcon.course) setCurrentCourse(course);
      }
    });
  }, [activeIcon]);

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesURL + user?.username);
  };

  const { isLoading, error, data } = useQuery("user_courses: " + user?.username, fetchCourse, {
    enabled: true,
    staleTime: 1000 * 60, //1 minute
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        setUserCourses(data.data.data);
      } else setFetchError(data.data.message);
    },
    onError: (error: string) => console.log(error),
  });

  const getDistinctCoursesByDepartment = (department: string) => {
    const courses = userCourses?.filter((course) => course.name.split(" ")[0] === department);
    //distinct named courses
    const distinctCourses = new Map<string, Course>();
    courses?.forEach((course) => {
      if (!distinctCourses.has(course.name)) distinctCourses.set(course.name, course);
    });
    return [...distinctCourses.values()];
  };

  const getCoursesByDepartment = (department: string) => {
    const courses = userCourses?.filter((course) => course.name.split(" ")[0] === department);
    return courses;
  };

  const isDepartmentSelected = () => {
    return activeIcon.course !== "" && !activeIcon.isActiveCourse;
  };

  // returns the most recent semester for a given course
  const getMostRecentSemester = (courses: Course[]) => {
    // activeIcon.course is the department name if this code is reached
    courses = courses.filter((course) => course.name.split(" ")[0] === activeIcon.course);

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

  const sideBarProps = {
    user,
    activeIcon,
    setActiveIcon,
    drawerWidth: 300,
    innerDrawerWidth: 85,
    currentCourse,
    getDistinctCoursesByDepartment,
  };

  const searchCourseProps = {
    user,
    showCourses,
    setShowCourses,
  };

  const SemesterSelector = () => {
    // if the active icon is a department
    if (isDepartmentSelected()) {
      return (
        <Select value={currentSemester || getMostRecentSemester(userCourses)} onChange={(e) => setCurrentSemester(e.target.value)}>
          <MenuItem disabled value="">
            Select Semester
          </MenuItem>
          {getCoursesByDepartment(activeIcon.course).map((course) => (
            <MenuItem key={course.semester} value={course.semester}>
              {course.semester}
            </MenuItem>
          ))}
        </Select>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar {...sideBarProps} />
      <SearchCourseModal {...searchCourseProps} />

      {!isLoading && !error && !fetchError ? (
        <Box sx={{ padding: defaultPadding, paddingLeft: `${sideBarProps.drawerWidth + 4 * defaultPadding}px` }}>
          <Typography variant="h4">{activeIcon.course || "Select a course or Department"}</Typography>
          <Button sx={{ paddingLeft: 0 }} onClick={() => setShowCourses(true)}>
            Add Courses
          </Button>
          <SemesterSelector />
        </Box>
      ) : (
        <Box sx={{ padding: defaultPadding, paddingLeft: `${sideBarProps.drawerWidth + 4 * defaultPadding}px` }}>
          {isLoading ? <Typography variant="h4">Loading...</Typography> : null}
          {error ? <Typography variant="h4">Error: {error}</Typography> : null}
          {fetchError ? <Typography variant="h4">Error: {fetchError}</Typography> : null}
        </Box>
      )}
    </Box>
  );
};

export default Home;
