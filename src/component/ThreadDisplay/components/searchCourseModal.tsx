import { Button, Box, TextField, Typography, IconButton, Stack, Autocomplete, Tooltip, Paper, Modal } from "globals/mui";
import { useEffect, useState } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { getAllCoursesURL, subscribeToCourseURL } from "API/CoursesAPI";
import { Course } from "globals/types";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "context/context";
import useStore from "store/store";

type Props = {
  showCourses: boolean;
  setShowCourses: (value: boolean) => void;
};

//TODO: fix bugs with adding courses (updating course list, removing from list on leave, etc)
const emptyCourse: Course = {
  _id: { $oid: "" },
  name: "",
  semester: "",
  description: "",
  instructor: "",
  memberCount: 0,
  userThread: { _id: { $oid: "" }, name: "", courseId: { $oid: "" }, numberOfPosts: 0 },
  modRoom: {
    _id: { $oid: "" },
    name: "",
    courseId: { $oid: "" },
    connected: [{ username: "", sid: "", profilePic: "" }],
    messages: [{ username: "", message: "", timeSent: "", profilePic: "", edited: false }],
  },
  rooms: [],
  owner: "",
  creationDate: { $date: "" },
  department: "",
};

const SearchCourseModal = ({ showCourses, setShowCourses }: Props) => {
  const api = useAxiosPrivate();
  const { setUser, user } = useAuth();
  // tracks all courses from db
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  // tracks the current filter for each course
  const [courseFilters, setUserFilteredCourses] = useState<string[]>([]);
  // tracks the current courses the user added
  const [userAddedCourses, setUserAddedCourses] = useState<Course[]>([emptyCourse]);
  // tracks the unique departments in course list
  const departments = new Set<string>();
  const distinctCourses = new Map<string, Course[]>();
  // tracks the current courses the user is in
  const [currentCourses, setCurrentCourses] = useState<Map<string, boolean>>(new Map<string, boolean>());

  const [userCourseList, updateUserCourseList, updateDistinctCoursesByDepartment, updateDistinctDepartments, setActiveIcon] = useStore((state) => [
    state.userCourseList,
    state.updateUserCourseList,
    state.updateDistinctCoursesByDepartment,
    state.updateDistinctDepartments,
    state.setActiveIcon,
  ]);

  //functions for state map
  const addCourseToMap = (courseName: string) => {
    const newMap = new Map(currentCourses);
    newMap.set(courseName, true);
    setCurrentCourses(newMap);
  };

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
    if (userAddedCourses.length === 1) {
      return;
    }
    const newCourses = [...userAddedCourses];
    newCourses.splice(index, 1);
    const newFilters = [...courseFilters];
    newFilters.splice(index, 1);
    setUserFilteredCourses(newFilters);
    setUserAddedCourses(newCourses);
  };

  const handleCourseDepartmentChange = (index: number, value: string) => {
    const newCourses = structuredClone(userAddedCourses);
    //save the department to the added course list
    newCourses[index].department = value;
    //clear the course name field
    newCourses[index].name = "";
    setUserAddedCourses(newCourses);

    //update the filter for the changed course
    const courseFilter = courseFilters;
    courseFilter[index] = value;
    setUserFilteredCourses(courseFilter);
  };

  const handleCourseNameChange = (index: number, value: string) => {
    const newCourses = structuredClone(userAddedCourses);
    //save the course name to the added course list and set the corresponding department
    newCourses[index].name = value;
    setUserAddedCourses(newCourses);

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
    setUserAddedCourses([...userAddedCourses, structEmptyCourse]);
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

  useEffect(() => {
    cacheCurrentCourses();
  }, [user]);

  // save the current courses the user is in in a map for easy access
  const cacheCurrentCourses = () => {
    if (user) {
      user.courses.forEach((userCourse) => {
        addCourseToMap(userCourse);
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

      //if no courses were added, do nothing
      if (courseNames.length === 0) {
        setShowCourses(false);
        return;
      }
      const response = await api.post(subscribeToCourseURL, { courses: courseNames, username: user?.username });
      if (response.data.statusCode === 200) {
        setShowCourses(false);
        //returns all the courses the user is in
        const newUserCourses = response.data.data;
        const newDepartments = newUserCourses.map((course) => course.department);

        //update states
        updateUserCourseList(newUserCourses, "add");
        updateDistinctDepartments(newDepartments, "add");
        updateDistinctCoursesByDepartment(newUserCourses, "add");
        setUser({ ...user, courses: [...user.courses, ...courseNames] });

        //clear the added courses
        setUserAddedCourses([{ ...emptyCourse }]);
      } else {
        console.log(response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const courseEntry = (course: Course, index: number) => {
    console.log(userCourseList);

    return (
      <Paper key={index} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction={"row"} spacing={2} sx={{ width: "600px" }}>
          <Autocomplete
            id="selectCourseDepartment"
            options={getUniqueDepartments()}
            getOptionLabel={(option) => option}
            value={userAddedCourses[index].department}
            renderOption={(props, option) => <li {...props}>{option ? option : "None"}</li>}
            onChange={(event, value) => {
              handleCourseDepartmentChange(index, value);
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
            renderOption={(props, option) => <li {...props}>{option.name ? option.name : "None"}</li>}
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
                <CheckCircleOutlineIcon color={userCourseList?.some((userCourse) => userCourse.name === course.name) ? "success" : "disabled"} />
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
      </Paper>
    );
  };

  const CourseSelection = () => {
    return (
      <Paper sx={{ p: 2 }}>
        <IconButton
          onClick={() => setShowCourses(false)}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Stack direction={"column"}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              paddingBottom: 2,
            }}
          >
            <Typography variant="h4">Add Courses</Typography>
          </Box>
          <Box
            sx={{
              overflow: "hidden",
              overflowY: "auto",
            }}
          >
            {userAddedCourses.map((course, index) => {
              return courseEntry(course, index);
            })}
          </Box>
          <Stack
            sx={{
              justifyContent: "space-between",
              paddingTop: 2,
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
            <Stack direction={"row"} spacing={2}>
              <Box flexGrow={1}></Box>
              <Button variant="contained" onClick={subscribeToCourses} disabled={getAddedCourses().length === 0}>
                Subscribe
              </Button>
              <Button variant="outlined" onClick={() => setShowCourses(false)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    );
  };

  return (
    <Modal open={showCourses} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: "10px",
          boxShadow: 24,
          paddingRight: 4,
          display: "flex",
          maxHeight: 450,
        }}
      >
        {!loading ? <CourseSelection /> : <Typography variant="h4">Loading Courses...</Typography>}
      </Box>
    </Modal>
  );
};
export default SearchCourseModal;
