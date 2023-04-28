import React, { useState, useEffect } from "react";
import { Box, Button, Autocomplete, TextField, Checkbox, FormHelperText, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { getAllCoursesURL, subscribeToCourseURL } from "../../API/CoursesAPI";
import { useAuth } from "../../context/context";
import { Course } from "../../globals/types";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack, Tooltip } from "@mui/material";

const emptyCourse: Course = {
  _id: { $oid: "" },
  name: "",
  semester: "",
  description: "",
  instructor: "",
  memberCount: 0,
  userThread: { $oid: "" },
  modRoom: { $oid: "" },
  rooms: [
    {
      _id: { $oid: "" },
      name: "",
      courseId: { $oid: "" },
      connected: [{ username: "", sid: "" }],
      messages: [{ username: "", message: "", timeSent: { $date: "" } }],
    },
  ],
  owner: "",
  creationDate: { $date: "" },
  department: "",
};

const ChooseThreads = () => {
  // courses is used for all courses
  const [courses, setCourses] = useState<Course[]>([]);
  // selected courses is used for user selected courses
  const [loading, setLoading] = useState(false);
  const api = useAxiosPrivate();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  // tracks the current filter for each course
  const [courseFilters, setUserFilteredCourses] = useState<string[]>([]);
  // tracks the current courses the user added
  const [userAddedCourses, setuserAddedCourses] = useState<Course[]>([emptyCourse]);
  // tracks the current courses the user is in
  const currentCourses = new Map<string, boolean>();
  // tracks the unique departments in course list
  const departments = new Set<string>();
  const distinctCourses = new Map<string, Course[]>();

  const navigateHome = () => {
    navigate("/home");
  };

  // handles added course removal
  const handleCourseIconClick = (index: number) => {
    // if only one course, do nothing
    if (userAddedCourses.length === 1) {
      return;
    }
    const newCourses = [...userAddedCourses];
    newCourses.splice(index, 1);
    const newFilters = [...courseFilters];
    newFilters.splice(index, 1);
    setUserFilteredCourses(newFilters);
    setuserAddedCourses(newCourses);
  };

  const handleCourseDepartmentChange = (index: number, value: string) => {
    const newCourses = structuredClone(userAddedCourses);
    //save the department to the added course list
    newCourses[index].department = value;
    //clear the course name field
    newCourses[index].name = "";
    setuserAddedCourses(newCourses);

    //update the filter for the changed course
    const courseFilter = courseFilters;
    courseFilter[index] = value;
    setUserFilteredCourses(courseFilter);
  };

  const handleCourseNameChange = (index: number, value: string) => {
    const newCourses = structuredClone(userAddedCourses);
    //save the course name to the added course list and set the corresponding department
    newCourses[index].name = value;
    setuserAddedCourses(newCourses);

    newCourses[index].department = value.split(" ")[0];
    //update the filter for the changed course
    const courseFilter = courseFilters;
    courseFilter[index] = value.split(" ")[0];
    setUserFilteredCourses(courseFilter);
  };

  const filterCourses = (index: number) => {
    if (!courseFilters[index]) {
      return getDistinctCourses();
    }
    return getDistinctCourses().filter((course) => course.department === courseFilters[index] || course.department === "");
  };

  const getUniqueDepartments = () => {
    courses.forEach((course) => {
      departments.add(course.department);
    });
    return Array.from(departments);
  };

  const getDistinctCourses = () => {
    courses.forEach((course) => {
      if (!distinctCourses.has(course.name)) {
        distinctCourses.set(course.name, [course]);
      } else {
        distinctCourses.get(course.name)?.push(course);
      }
    });
    return Array.from(distinctCourses.values()).map((course) => course[0]);
  };

  const addEmptyCourse = () => {
    const structEmptyCourse = structuredClone(emptyCourse);
    setuserAddedCourses([...userAddedCourses, structEmptyCourse]);
  };

  useEffect(() => {
    setLoading(true);
    const getCourses = async () => {
      try {
        const response = await api.get(getAllCoursesURL);
        //console.log(response);
        if (response.data.statusCode === 200) {
          setCourses([structuredClone(emptyCourse), ...response.data.data]);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourses();
  }, []);

  // save the current courses the user is in in a map for easy access
  const cacheCurrentCourses = () => {
    if (user) {
      user.courses.forEach((userCourse) => {
        currentCourses.set(userCourse, true);
      });
    }
  };

  const getAddedCourses = () => {
    return userAddedCourses
      .map((course) => course.name)
      .filter((course) => course !== "")
      .filter((course) => !currentCourses.has(course));
  };

  const subscribeToCourses = async () => {
    try {
      //filter out empty courses and courses the user is already in
      const courseNames = getAddedCourses();

      const response = await api.post(subscribeToCourseURL, { courses: courseNames, username: user?.username });
      if (response.data.statusCode === 200) {
        //update the user context
        setUser({ ...user, courses: [...user.courses, ...courseNames] });
        //returns all the courses the user is in
        const matchingCourses = courses.filter((course) => courseNames.includes(course.name));
        // setUserCourses([...userCourses, ...matchingCourses]);
        //console.log(matchingCourses);
        navigate("/home");
      } else {
        console.log(response.data.message);
        //TODO: handle error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const courseEntry = (course: Course, index: number) => {
    let departmentFilter = "";
    cacheCurrentCourses();
    return (
      <Box key={index} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
          <Autocomplete
            id="selectCourseDepartment"
            options={getUniqueDepartments()}
            getOptionLabel={(option) => option}
            value={userAddedCourses[index].department}
            renderOption={(props, option) => <li {...props}>{option}</li>}
            onChange={(event, value) => {
              handleCourseDepartmentChange(index, value);
              departmentFilter = value;
            }}
            sx={{
              width: "30%",
              mb: "10px",
            }}
            renderInput={(params) => <TextField {...params} label="" placeholder="Department" />}
          />
          <Autocomplete
            id="selectCourseName"
            isOptionEqualToValue={(option, value) => option.name === value.name}
            options={filterCourses(index)}
            value={userAddedCourses[index]}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            onChange={(event, value) => {
              if (value) {
                handleCourseNameChange(index, value.name);
              }
            }}
            sx={{
              width: "70%",
              mb: "10px",
            }}
            renderInput={(params) => <TextField {...params} label="" placeholder="Course Name / Number" />}
          />
          <Stack spacing={2} direction="row">
            <IconButton
              disableRipple
              sx={{
                pointerEvents: currentCourses.get(course.name) ? "auto" : "none",
              }}
            >
              <Tooltip title={currentCourses.get(course.name) ? "Subscribed" : "Delete"}>
                <CheckCircleOutlineIcon color={currentCourses.get(course.name) ? "success" : "disabled"} />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                handleCourseIconClick(index);
              }}
              disabled={userAddedCourses.length === 1}
              sx={{
                pointerEvents: userAddedCourses.length === 1 ? "none" : "auto",
              }}
            >
              <Tooltip title={userAddedCourses.length === 1 ? "" : "Delete"}>
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    );
  };

  const CourseSelection = () => {
    return (
      <React.Fragment>
        <Stack direction={"column"} sx={{ width: "100%" }}>
          <Box
            sx={{
              overflow: "hidden",
              overflowY: "auto",
              pt: 2,
            }}
            className="scrollBar"
          >
            {userAddedCourses.map((course, index) => {
              return courseEntry(course, index);
            })}
          </Box>
          <Stack
            sx={{
              justifyContent: "space-between",
              pt: 2,
              display: "flex",
            }}
          >
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={addEmptyCourse}
                sx={{
                  width: "40px",
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {/* <Stack direction={"row"} spacing={2}>
              <Box flexGrow={1}></Box> */}
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                pb: 2,
              }}
            >
              <Button variant="outlined" onClick={subscribeToCourses} disabled={getAddedCourses().length === 0}>
                Subscribe
              </Button>
            </Box>
            {/* </Stack> */}
          </Stack>
        </Stack>
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <AppBar
        sx={{
          position: "relative",
          height: "8%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <Typography sx={{ flex: 1, textAlign: "center" }} variant="h6" component="div">
            Choose Threads to Join
          </Typography>
          <Button color="inherit" onClick={navigateHome}>
            Skip
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          overflowY: "auto",
          width: "100%",
        }}
      >
        {!loading ? <CourseSelection /> : <Typography variant="h4">Loading Courses...</Typography>}
      </Box>
    </Box>
  );
};

export default ChooseThreads;
