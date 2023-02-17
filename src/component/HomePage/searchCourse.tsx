import { Button, Box, TextField, InputAdornment, Typography, Divider, Modal, IconButton, Stack, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { getAllCoursesURL } from "./../../API/CoursesAPI";
import CloseIcon from "@mui/icons-material/Close";
import { Course } from "../../types/types";
import { useAuth } from "../../context/context";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

type Props = {
  showCourses: boolean;
  setShowCourses: (value: boolean) => void;
};
const emptyCourse: Course = {
  _id: { $oid: "" },
  name: "",
  semester: "",
  description: "",
  instructor: "",
  memberCount: 0,
  userThread: { $oid: "" },
  modRoom: { $oid: "" },
  generalRoom: { $oid: "" },
  owner: "",
  creationDate: { $date: "" },
  department: "",
};

const SearchCourse = ({ showCourses, setShowCourses }: Props) => {
  const api = useAxiosPrivate();
  const { user } = useAuth();
  // tracks all courses from db
  const [courses, setCourses] = useState<Course[]>([]);
  // tracks the current filter for each course
  const [courseFilters, setUserFilteredCourses] = useState<string[]>([]);
  // tracks the current courses the user added
  const [userCourses, setUserCourses] = useState<Course[]>([emptyCourse]);
  // tracks the current courses the user is in
  const currentCourses = new Map();
  // tracks the unique departments in course list
  const departments = new Set<string>();

  // handles modal close
  const handleClose = (event: Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setShowCourses(false);
  };

  // handles added course removal
  const handleCourseIconClick = (index: number) => {
    // if only one course, do nothing
    if (userCourses.length === 1) {
      return;
    }
    const newCourses = [...userCourses];
    newCourses.splice(index, 1);
    setUserCourses(newCourses);
  };

  const handleCourseDepartmentChange = (index: number, value: string) => {
    const newCourses = structuredClone(userCourses);
    //save the department to the added course list
    newCourses[index].department = value;
    //clear the course name field
    newCourses[index].name = "";
    setUserCourses(newCourses);

    //update the filter for the changed course
    const courseFilter = courseFilters;
    courseFilter[index] = value;
    setUserFilteredCourses(courseFilter);
  };

  const handleCourseNameChange = (index: number, value: string) => {
    const newCourses = structuredClone(userCourses);
    //save the course name to the added course list and set the corresponding department
    newCourses[index].name = value;
    newCourses[index].department = value.split(" ")[0];
    setUserCourses(newCourses);
  };

  const filterCourses = (index: number) => {    
    if (!courseFilters[index]) {
      return courses;
    }
    return courses.filter((course) => course.department === courseFilters[index] || course.department === "");
  };

  const getUniqueDepartments = () => {
    courses.forEach((course) => {
      departments.add(course.department);
    });
    return Array.from(departments);
  };

  const addEmptyCourse = () => {
    const structEmptyCourse = structuredClone(emptyCourse);
    setUserCourses([...userCourses, structEmptyCourse]);
  };

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await api.get(getAllCoursesURL);
        //console.log(response);
        if (response.status === 200) {
          setCourses([structuredClone(emptyCourse), ...response.data.data]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCourses();
  }, []);


  // save the current courses the user is in in a map for easy access
  useEffect(() => {
    const saveCurrentCourses = () => {
      if (user) {
        user.courses.forEach((userCourse) => {
          courses.forEach((course) => {
            if (course.name === userCourse) {
              currentCourses.set(course, true);
            }
          });
        });
      }
    };
    saveCurrentCourses();
  }, [courses]);

  const courseEntry = (course: Course, index: number) => {
    let departmentFilter = "";
    return (
      <Box key={index} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction={"row"} spacing={2} sx={{ width: "600px" }}>
          <Autocomplete
            id="selectCourseDepartment"
            options={getUniqueDepartments()}
            getOptionLabel={(option) => option}
            value={userCourses[index].department}
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
            value={userCourses[index]}
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
          <IconButton disabled={currentCourses.get(course)} onClick={() => handleCourseIconClick(index)}>
            {currentCourses.get(course) ? <CheckIcon /> : <CloseIcon />}
          </IconButton>
        </Stack>
      </Box>
    );
  };

  return (
    <Modal open={showCourses} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: 600,
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          display: "flex",
        }}
      >
        <Stack direction={"column"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              mb: "10px",
            }}
          >
            <Typography variant="h4">Add Courses</Typography>
          </Box>{" "}
          {/* <Stack direction={"row"} spacing={8}>
            <Typography variant="body1">Department</Typography>
            <Typography variant="body1">Course Name/Course Number</Typography>
          </Stack> */}
          <IconButton
            onClick={() => setShowCourses(false)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
          {userCourses.map((course, index) => {
            return courseEntry(course, index);
          })}
          <IconButton
            onClick={addEmptyCourse}
            sx={{
              position: "absolute",
              bottom: 0,
              right: "50%",
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>
    </Modal>
  );
};
export default SearchCourse;
