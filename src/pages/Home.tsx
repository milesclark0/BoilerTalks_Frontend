import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import { getUserCoursesURL, getCourseURL, getCourseUsersURL } from "../API/CoursesAPI";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Course } from "../types/types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

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
  const [courseUsers, setCourseUsers] = useState([]);

  const defaultPadding = 4;
  const drawerWidth = 300;
  const innerDrawerWidth = 85;
  const appBarHeight = 64;

  useEffect(() => {
    userCourses.forEach((course) => {
      if (activeIcon.isActiveCourse) {
        if (course.name === activeIcon.course) setCurrentCourse(course);
      }
    });
  }, [activeIcon]);
//userlist

  useEffect(() => {
    const fetchCourseUsers = async () => {
      const res = await axiosPrivate.get(getCourseUsersURL + activeIcon.course);
      if(res.data.statusCode == 200) {
        console.log(res.data.data);
        setCourseUsers(res.data.data);
      }
    };
    if(isCourseSelected()){
      fetchCourseUsers();
    }
  }, [activeIcon]);

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesURL + user?.username);
  };

  

  const { isLoading, error, data } = useQuery("user_courses: " + user?.username, fetchCourse, {
    enabled: true,
    staleTime: 1000 * 60, //1 minute
    refetchOnMount: "always",
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

  const getCoursesByName = (courseName: string) => {
    const courses = userCourses?.filter((course) => course.name === courseName);
    return courses;
  };

  const isCourseSelected = () => {
    return activeIcon.course !== "" && activeIcon.isActiveCourse;
  };

  // returns the most recent semester for a given course
  const getMostRecentSemester = (courses: Course[]) => {
    courses = courses.filter((course) => course.name === activeIcon.course);

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
    drawerWidth,
    innerDrawerWidth,
    appBarHeight,
    currentCourse,
    getDistinctCoursesByDepartment,
    setUserCourses,
    userCourses,
  };

  const searchCourseProps = {
    user,
    showCourses,
    setShowCourses,
    setUserCourses,
    userCourses,
  };

  const SemesterSelector = () => {
    // if the active icon is a department
    if (isCourseSelected()) {
      return (
        <Select
          size="small"
          value={currentSemester || getMostRecentSemester(userCourses)}
          onChange={(e) => {
            setCurrentSemester(e.target.value as string);
            const course = userCourses.find((course) => course.name === currentCourse.name && course.semester === e.target.value);
            if (course) setCurrentCourse(course);
            console.log(course);
          }}
        >
          <MenuItem disabled value="">
            Select Semester
          </MenuItem>
          {getCoursesByName(activeIcon.course).map((course) => (
            <MenuItem key={course.semester} value={course.semester}>
              {course.semester}
            </MenuItem>
          ))}
        </Select>
      );
    }
    return null;
  };

  const SearchUserField = () => {
    if(isCourseSelected() === false) return null;
    return(
      <Autocomplete
      value={value}
      onChange={(event, value) => {
        setValue(value);
      }}
      id="combo-box-demo"
      options={courseUsers}
      getOptionLabel={(option) => {
          if(option?.username === undefined)
          {
            return "";
          }
          else
          {
            return option?.username;
          }
      }}
      sx={{ width: 300 }}  
      renderInput={(params) => <TextField {...params} variant="outlined" color="info" label="Search users..." />}
    />
    );
  }

  const [value, setValue] = React.useState<string>("");
  /*const filter = createFilterOptions<UserOptionType>();
  
  interface UserOptionType {
    username: string;
  }*/
  
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar {...sideBarProps} />
      <SearchCourseModal {...searchCourseProps} />

      {!isLoading && !error && !fetchError ? (
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, height: appBarHeight, alignContent: "center" }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", flexGrow: 1, height: appBarHeight }}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {activeIcon.course || "Select a course or Department"}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setShowCourses(true)}
                sx={{
                  color: "white",
                }}
              >
                Add Courses
              </Button>
              <SemesterSelector />
            </Box>
            <Box>
              <SearchUserField/>
            </Box>
          </Toolbar>
        </AppBar>
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
