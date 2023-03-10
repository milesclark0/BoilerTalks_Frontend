import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import EmojiPicker, { EmojiStyle, Theme, EmojiClickData, Emoji } from "emoji-picker-react";
import { getUserCoursesURL, getCourseUsersURL } from "../API/CoursesAPI";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Course, Room } from "../types/types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MessageBox from "./../component/HomePage/messageBox";
import UserBar from "./../component/HomePage/userBar";
import useSockets from "../hooks/useSockets";

const Home = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [showCourses, setShowCourses] = useState(false);
  const [activeIcon, setActiveIcon] = useState<{
    course: string;
    isActiveCourse: boolean;
  }>({ course: "", isActiveCourse: false });
  //this value will hold the actual course data (all semesters included) for each user course
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room>(null);
  const [distinctCoursesByDepartment, setDistinctCoursesByDepartment] = useState<Course[]>([]);
  const [distinctDepartments, setDistinctDepartments] = React.useState<string[]>([]); //What the new thread name string is
  const [currentSemester, setCurrentSemester] = useState<string>("");
  const [fetchError, setFetchError] = useState("");
  const [courseUsers, setCourseUsers] = useState([]);
  const navigate = useNavigate();
  const { message, setMessage, messages, setMessages, sendMessage, connectToRoom, disconnectFromRoom } = useSockets();
  const { courseId, roomId } = useParams();

  const defaultPadding = 4;
  const drawerWidth = 300;
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

  const getActiveCourses = () => {
    const activeCourses = [];
    user?.activeCourses.forEach((course) => {
      userCourses.forEach((userCourse) => {
        if (course === userCourse.name) {
          activeCourses.push(userCourse);
        }
      });
    });
    return activeCourses;
  };

  useEffect(() => {
    if (courseId) {
      const course = getCourseFromUrl();
      setCurrentCourse(course);
      //if course iname is in user active courses, set it as the active icon else set as the department name
      const activeCourses = getActiveCourses();
      if (activeCourses.find((activeCourse) => activeCourse.name === course.name)) {
        setActiveIcon({ course: course?.name, isActiveCourse: true });
      } else {
        setActiveIcon({ course: course?.department, isActiveCourse: false });
      }
      if (roomId) {
        const room = getRoomFromUrl();
        setCurrentRoom(room);
      }
    }
  }, [userCourses]);

  useEffect(() => {
    if (activeIcon.isActiveCourse) {
      userCourses.forEach((course) => {
        if (course.name === activeIcon.course) {
          setCurrentCourse(course);
          setCurrentRoom(course?.rooms[0]);
          //navigate to home/courses/courseId
          navigate(`/home/courses/${course._id.$oid}/${course?.rooms[0]._id.$oid}`, { replace: true });
        }
      });
    } else {
      //will always trigger on page load when activeIcon is {course: "", isActiveCourse: false}
      setDistinctCoursesByDepartment(getDistinctCoursesByDepartment(activeIcon.course));
      setCurrentCourse(getCourseFromUrl() || null);
      setCurrentRoom(getRoomFromUrl() || null);
    }
  }, [activeIcon]);

  // when the current course changes, we want to update the messages
  useEffect(() => {
    if (currentCourse) {
      assignMessages(currentCourse.rooms[0]);
    }
  }, [currentCourse]);

  // when the current room changes, we want to update the messages
  useEffect(() => {
    if (currentRoom) {
      assignMessages(currentRoom);
    }
  }, [currentRoom]);

  useEffect(() => {
    const fetchCourseUsers = async () => {
      if (activeIcon.course === "") return;
      const res = await axiosPrivate.get(getCourseUsersURL + activeIcon.course);
      if (res.data.statusCode == 200) {
        setCourseUsers(res.data.data);
      }
    };
    if (isCourseSelected()) {
      fetchCourseUsers();
    }
  }, [activeIcon]);

  const fetchCourse = async () => {
    return await axiosPrivate.get(getUserCoursesURL + user?.username);
  };

  const assignMessages = (room: Room) => {
    //find room in userCourses since currentRoom messages are not updated
    let foundRoom: Room;
    userCourses?.forEach((course) => {
      course.rooms.forEach((room) => {
        if (room.name === currentRoom?.name) {
          foundRoom = room;
        }
      });
    });

    const newMessages = foundRoom.messages.map((message) => {
      const newMessage = {
        username: message.username,
        message: message.message,
        timeSent: message.timeSent,
      };
      return newMessage;
    });
    setMessages(newMessages);
  };

  const { isLoading, error, data } = useQuery("user_courses: " + user?.username, fetchCourse, {
    enabled: true,
    refetchInterval: 1000 * 60 * 2, //2 minutes
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        //sort rooms by name
        const courses: Course[] = data.data.data;
        courses.forEach((course) => {
          course.rooms?.sort((a, b) => (a.name < b.name ? -1 : 1));
        });

        setUserCourses(courses);
      } else setFetchError(data.data.data);
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
    return currentCourse !== null;
  };

  const isDepartmentSelected = () => {
    return activeIcon.course !== "" && !activeIcon.isActiveCourse;
  };

  const isRoomSelected = () => {
    return currentRoom !== null;
  };

  // returns the most recent semester for a given course
  const getMostRecentSemester = (courses: Course[]) => {
    courses = courses.filter((course) => course.name === currentCourse.name);

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
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    setCurrentCourse,
    distinctDepartments,
    setDistinctDepartments,
    currentRoom,
    setCurrentRoom,
  };

  const userBarProps = {
    innerDrawerWidth,
    drawerWidth,
    appBarHeight,
    currentCourse,
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

  const messageBoxProps = {
    currentCourse,
    setCurrentCourse,
    userCourses,
    setUserCourses,
    currentRoom,
    setCurrentRoom,
    activeIcon,
    setActiveIcon,
    message,
    setMessage,
    messages,
    setMessages,
    sendMessage,
    connectToRoom,
    disconnectFromRoom,
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
            if (course) {
              setCurrentCourse(course);
              setCurrentRoom(course.rooms[0]);
            }
          }}
        >
          <MenuItem disabled value="">
            Select Semester
          </MenuItem>
          {getCoursesByName(currentCourse.name).map((course) => (
            <MenuItem key={course.semester} value={course.semester}>
              {course.semester}
            </MenuItem>
          ))}
        </Select>
      );
    }
    return null;
  };

  const navigateToProfile = (username: string) => {
    navigate("/profile/" + username);
  };

  const SearchUserField = () => {
    const [value, setValue] = React.useState<string>();
    const handleEnter = (e) => {
      if (e.keyCode === 13 && value != null) {
        console.log(value["username"]);
        navigateToProfile(value["username"]);
      }
    };
    if (isCourseSelected() === false) return null;
    return (
      <Autocomplete
        value={value}
        onChange={(event, value) => {
          setValue(value);
        }}
        id="user-search-bar"
        options={courseUsers}
        getOptionLabel={(option) => {
          if (option?.username === undefined) {
            return "";
          } else {
            return option?.username;
          }
        }}
        sx={{ width: drawerWidth - innerDrawerWidth }}
        renderInput={(params) => <TextField onKeyDown={(e) => handleEnter(e)} {...params} variant="outlined" color="info" label="Search users..." />}
      />
    );
  };

  const EmojiPanel = () => {
    const [selectedEmojis, setSelectedEmojis] = useState<string>("");

    return (
      <div>
        <div>
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(emojiData: EmojiClickData) => {
              setSelectedEmojis(emojiData.unified);
              console.log(selectedEmojis);
            }}
          />
        </div>
        <div className="show-emoji">
          Your selected Emoji is:
          {selectedEmojis ? <Emoji unified={selectedEmojis} emojiStyle={EmojiStyle.APPLE} size={22} /> : null}
        </div>
      </div>
    );
  };

  const toggleEmojiPanel = () => {
    setShowEmojiPanel(!showEmojiPanel);
  };

  const [showEmojiPanel, setShowEmojiPanel] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar {...sideBarProps} />
      <SearchCourseModal {...searchCourseProps} />
      {!isLoading && !error && !fetchError ? (
        <Box sx={{ pl: `${drawerWidth}px`, width: "100%", height: "100%" }}>
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
                  {/* {`${currentCourse?.name}: ${currentRoom?.name.replace(currentCourse?.name, "")}` ||
                    activeIcon.course ||
                    "Select a course or Department"} */}
                  {currentCourse?.name
                    ? `${currentCourse?.name}: ${currentRoom?.name.replace(currentCourse?.name, "")}`
                    : activeIcon.course || "Select a course or Department"}
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
                <SearchUserField />
              </Box>
            </Toolbar>
          </AppBar>
          {/* get user and see if they have warning or ban */}
          {/* <WarningDialog/> */}
          {/* <BanDialog/> */}
          <Box>
            <Box sx={{ padding: defaultPadding, mt: `${appBarHeight}px` }}>
              {isCourseSelected() && isRoomSelected() && <Typography variant="h4">Messages</Typography>}
              {isCourseSelected() ? (
                messages.length > 0 ? (
                  messages.map((message, index) => (
                    <Typography key={index} variant="h6">
                      {`[${message.username}]: ${message.message}`}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="h6">No messages yet!</Typography>
                )
              ) : null}
            </Box>
            <Button onClick={toggleEmojiPanel}>Open emoji dialog</Button>
            {showEmojiPanel && <EmojiPanel />}
            {currentCourse && <UserBar {...userBarProps} />}
            {currentRoom && (
              <Box
                sx={{
                  height: `${appBarHeight}px`,
                  position: "absolute",
                  bottom: 20,
                  right: `${drawerWidth - innerDrawerWidth + 3 * 8}px`,
                  left: `${drawerWidth}px`,
                }}
              >
                <MessageBox {...messageBoxProps} />
              </Box>
            )}
          </Box>
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
