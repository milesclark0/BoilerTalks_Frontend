import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room, Message } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/userBar";
import MessageBox from "../HomePage/messageBox";
import { getBannedUsersURL } from "../../API/CoursesAPI";
import BanDialog from "../SideBar/CourseView/BanDialog";
import WarningDialog from "../SideBar/CourseView/WarningDialog";

type Props = {
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (
    message: { username: string; message: string; timeSent: string },
    room: Room,
    isSystemMessage: boolean
  ) => void;
  connectToRoom: (room: Room) => void;
  disconnectFromRoom: (room: Room) => void;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  distinctCoursesByDepartment: Course[];
  setDistinctCoursesByDepartment: React.Dispatch<React.SetStateAction<Course[]>>;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
};

const RoomDisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const {
    message,
    setMessage,
    messages,
    setMessages,
    sendMessage,
    connectToRoom,
    disconnectFromRoom,
  } = useSockets();
  const { courseId, roomId } = useParams();
  const { roomProps } = useOutletContext<{
    roomProps: Props;
  }>();
  const [banned, setBanned] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // get banned users
    const fetchBannedUsers = async () => {
      const res = await axiosPrivate.get(getBannedUsersURL + courseId);
      // console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          if (res.data.data.includes(user)) {
            setBanned(true);
          }
        } else {
          setBanned(false);
        }
      }
    };
    if (roomProps.currentCourse) {
      fetchBannedUsers();
    }
  }, [roomProps.currentCourse]);

  // when the current course changes, we want to update the messages
  useEffect(() => {
    if (roomProps.currentCourse) {
      assignMessages(roomProps.currentCourse.rooms[0]);
    }
  }, [roomProps.currentCourse]);

  // when the current room changes, we want to update the messages
  useEffect(() => {
    if (roomProps.currentRoom) {
      assignMessages(roomProps.currentRoom);
    }
  }, [roomProps.currentRoom]);

  const getCourseFromUrl = () => {
    const course = roomProps.userCourses?.find((course) => course._id.$oid === courseId);
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
      roomProps.userCourses.forEach((userCourse) => {
        if (course === userCourse.name) {
          activeCourses.push(userCourse);
        }
      });
    });
    return activeCourses;
  };

  const getDistinctCoursesByDepartment = (department: string) => {
    const courses = roomProps.userCourses?.filter(
      (course) => course.name.split(" ")[0] === department
    );
    //distinct named courses
    const distinctCourses = new Map<string, Course>();
    courses?.forEach((course) => {
      if (!distinctCourses.has(course.name)) distinctCourses.set(course.name, course);
    });
    return [...distinctCourses.values()];
  };

  useEffect(() => {
    if (roomProps.activeIcon.isActiveCourse) {
      roomProps.userCourses.forEach((course) => {
        if (course.name === roomProps.activeIcon.course) {
          roomProps.setCurrentCourse(course);
          roomProps.setCurrentRoom(course?.rooms[0]);
          //navigate to home/courses/courseId
          // navigate(`/home/courses/${course._id.$oid}/${course?.rooms[0]._id.$oid}`, { replace: true });
          navigate(
            `/home/courses/${course._id.$oid}/${course?.rooms[0].name
              .replace(course?.name, "")
              .replace(/\s/g, "")}`,
            { replace: true }
          );
        }
      });
    } else {
      //will always trigger on page load when activeIcon is {course: "", isActiveCourse: false}
      roomProps.setDistinctCoursesByDepartment(
        getDistinctCoursesByDepartment(roomProps.activeIcon.course)
      );
      roomProps.setCurrentCourse(getCourseFromUrl() || null);
      roomProps.setCurrentRoom(getRoomFromUrl() || null);
    }
  }, [roomProps.activeIcon]);

  useEffect(() => {
    if (courseId) {
      const course = getCourseFromUrl();
      roomProps.setCurrentCourse(course);
      //if course iname is in user active courses, set it as the active icon else set as the department name
      const activeCourses = getActiveCourses();
      if (activeCourses.find((activeCourse) => activeCourse.name === course.name)) {
        roomProps.setActiveIcon({ course: course?.name, isActiveCourse: true });
      } else {
        roomProps.setActiveIcon({ course: course?.department, isActiveCourse: false });
      }
      if (roomId) {
        const room = getRoomFromUrl();
        roomProps.setCurrentRoom(room);
      }
    }
  }, [roomProps.userCourses]);

  const assignMessages = (room: Room) => {
    //find room in userCourses since currentRoom messages are not updated
    let foundRoom: Room;
    roomProps.userCourses?.forEach((course) => {
      course.rooms.forEach((room) => {
        if (room.name === roomProps.currentRoom?.name) {
          foundRoom = room;
        }
      });
    });

    const newMessages = foundRoom?.messages.map((message) => {
      const newMessage = {
        username: message.username,
        message: message.message,
        timeSent: message.timeSent,
      };
      return newMessage;
    });
    setMessages(newMessages);
  };

  return (
    <Box sx={{ height: "100%" }}>
      {banned && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <BanDialog />
        </Box>
      )}
      {!banned && (
        <Box sx={{ height: "100%" }} id="test2">
          <Box
            sx={{
              p: 4,
              width: `calc(100% - ${roomProps.drawerWidth * 2}px)`,
              maxHeight: "80%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
            className="scrollBar"
          >
            {messages?.length > 0 ? (
              <Box>
                <Typography variant="h4">Messages</Typography>
                <Box>
                  {messages.map((message, index) => (
                    <Box key={index}>
                      <Typography variant="h6">{`[${message.username}]: `}</Typography>
                      <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                        {message.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">No messages yet!</Typography>
            )}
          </Box>
          <UserBar {...roomProps} />
          <Box
            sx={{
              height: `${roomProps.appBarHeight}px`,
              position: "absolute",
              bottom: 20,
              right: `${roomProps.drawerWidth - roomProps.innerDrawerWidth + 3 * 8}px`,
              left: `${roomProps.drawerWidth}px`,
            }}
          >
            <MessageBox {...roomProps} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDisplay;
