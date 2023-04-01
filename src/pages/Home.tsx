import { useAuth } from "../context/context";
import { useState, useEffect } from "react";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Box, Button, Paper, Toolbar, Typography } from "@mui/material";
import { Course, Room } from "../types/types";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSockets from "../hooks/useSockets";
import { useCourseUsers } from "../component/HomePage/hooks/useCourseUsers";
import { useUserCourses } from "../component/HomePage/hooks/useUserCourses";
import { SemesterSelector } from "../component/HomePage/semesterSelector";
import { SearchUserBox } from "./../component/HomePage/searchUserBox";

const Home = () => {
  const { user } = useAuth();
  const [showCourses, setShowCourses] = useState(false);
  const [activeIcon, setActiveIcon] = useState<{
    course: string;
    isActiveCourse: boolean;
  }>({ course: "", isActiveCourse: false });
  //this value will hold the actual course data (all semesters included) for each user course
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room>(null);
  const [distinctCoursesByDepartment, setDistinctCoursesByDepartment] = useState<Course[]>([]);
  const [distinctDepartments, setDistinctDepartments] = useState<string[]>([]); //What the new thread name string is
  const [activeCourseThread, setActiveCourseThread] = useState<string>("");
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  const navigate = useNavigate();
  const { courseId, roomId } = useParams();

  const defaultPadding = 4;
  const drawerWidth = 320;
  const innerDrawerWidth = 85;
  const appBarHeight = 64;

  const getCourseFromUrl = () => {
    const course = userCourses?.find((course) => course._id.$oid === courseId);
    return course;
  };

  const getRoomFromUrl = () => {
    const course = getCourseFromUrl();
    const room = course?.rooms.find((room) => room._id.$oid === roomId);
    return room;
  };

  const toggleEmojiPanel = () => {
    setShowEmojiPanel(!showEmojiPanel);
  };

  useEffect(() => {
    console.log(activeIcon);
    if (activeIcon.isActiveCourse) {
      userCourses.forEach((course) => {
        if (course.name === activeIcon.course) {
          setCurrentCourse(course);
          setCurrentRoom(course?.rooms[0]);
          setActiveCourseThread(getRoomFromUrl()?.name.replace(getCourseFromUrl()?.name, ""));
          //navigate to home/courses/courseId
          navigate(`/home/courses/${course._id.$oid}/${course?.rooms[0]._id.$oid}`, {
            replace: true,
          });
          // navigate(`/home/courses/${course._id.$oid}/${course?.rooms[0].name.replace(course?.name, "").replace(/\s/g, "")}`, { replace: true });
        }
      });
    } else {
      //will always trigger on page load when activeIcon is {course: "", isActiveCourse: false}
      setDistinctCoursesByDepartment(getDistinctCoursesByDepartment(activeIcon.course));
      setCurrentCourse(getCourseFromUrl() || null);
      setCurrentRoom(getRoomFromUrl() || null);
      // console.log(getRoomFromUrl()?.name)
      setActiveCourseThread(getRoomFromUrl()?.name.replace(getCourseFromUrl()?.name, ""));
    }
  }, [activeIcon]);

  // gets the distinct courses for a department
  const getDistinctCoursesByDepartment = (department: string) => {
    const courses = userCourses?.filter((course) => course.name.split(" ")[0] === department);
    //distinct named courses
    const distinctCourses = new Map<string, Course>();
    courses?.forEach((course) => {
      if (!distinctCourses.has(course.name)) distinctCourses.set(course.name, course);
    });
    return [...distinctCourses.values()];
  };

  const isCourseSelected = () => {
    return currentCourse !== null;
  };
  
  const { courseUsers } = useCourseUsers({ activeIcon, isCourseSelected, currentCourse });
  const { userCourses, setUserCourses, isLoading, fetchError, error } = useUserCourses({
    setCurrentCourse,
    setCurrentRoom,
    setActiveIcon,
    getCourseFromUrl,
    getRoomFromUrl,
  });

  const sideBarProps = {
    user,
    activeIcon,
    setActiveIcon,
    drawerWidth,
    innerDrawerWidth,
    appBarHeight,
    currentCourse,
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    setCurrentCourse,
    distinctDepartments,
    setDistinctDepartments,
    currentRoom,
    setCurrentRoom,
    setActiveCourseThread,
    activeCourseThread,
  };

  const roomProps = {
    activeIcon,
    setActiveIcon,
    drawerWidth,
    innerDrawerWidth,
    appBarHeight,
    defaultPadding,
    currentCourse,
    distinctCoursesByDepartment,
    setDistinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    setCurrentCourse,
    distinctDepartments,
    setDistinctDepartments,
    currentRoom,
    setCurrentRoom,
    setActiveCourseThread,
    courseUsers,
  };

  const searchCourseProps = {
    user,
    showCourses,
    setShowCourses,
    setUserCourses,
    userCourses,
    setActiveIcon,
    activeIcon,
    distinctDepartments,
    setDistinctDepartments,
  };

  const semesterSelectorProps = {
    currentCourse,
    setCurrentCourse,
    setCurrentRoom,
    isCourseSelected,
    userCourses,
  };

  const searchUserBoxProps = {
    courseUsers,
    isCourseSelected,
    drawerWidth,
    innerDrawerWidth,
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <SideBar {...sideBarProps} />
      <SearchCourseModal {...searchCourseProps} />
      {!isLoading && !error && !fetchError ? (
        <Box sx={{ pl: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }} id="home">
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              height: appBarHeight,
              alignContent: "center",
            }}
          >
            <Toolbar sx={{ padding: 0 }}>
              <Box sx={{ display: "flex", flexGrow: 1, height: appBarHeight }}>
                <Typography variant="h5" sx={{ p: 2 }}>
                  {currentCourse?.name ? `${currentCourse?.name}: ${activeCourseThread}` : activeIcon.course || "Select a Department or Course"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowCourses(true)}
                  sx={{
                    
                  }}
                >
                  Add Courses
                </Button>
                <SemesterSelector {...semesterSelectorProps} />
              </Box>
              <Box>
                <SearchUserBox {...searchUserBoxProps} />
              </Box>
            </Toolbar>
          </AppBar>
          <Paper
            sx={{
              mt: `${appBarHeight}px`,
              height: `calc(100% - ${appBarHeight}px)`,
              // width: `calc(100% - ${drawerWidth}px)`,
              width: "100%",
            }}
            id="threads"
          >
            {/* renders display for the current room/thread etc */}
              <Outlet context={{ roomProps }} />
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            padding: defaultPadding,
            paddingLeft: `${sideBarProps.drawerWidth + 4 * defaultPadding}px`,
          }}
        >
          {isLoading ? <Typography variant="h4">Loading...</Typography> : null}
          {error ? <Typography variant="h4">Error: {error}</Typography> : null}
          {fetchError ? <Typography variant="h4">Error: {fetchError}</Typography> : null}
        </Box>
      )}
    </Box>
  );
};

export default Home;
