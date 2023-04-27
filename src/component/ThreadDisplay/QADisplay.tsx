// Display for Q&A
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography, Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Course, Room, Question} from "../../globals/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/components/userBar";
import { useStore } from "zustand";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  courseUsers: any[];
};

const QADisplay = () => {
  const [currentCourse, questions, setQuestions, userCourseList, setCurrentCourse, setActiveCourseThread] = useStore(

  );

  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          // console.log(resData)
          const userBanned = [];
          resData?.bannedUsers.forEach((item) => {
            userBanned.push(item.username);
            if (item.username === user?.username) {
              // find if user has sent an appeal
              resData?.appeals.forEach((appeal) => {
                if (appeal.username === user?.username) {
                  setAppealData(appeal);
                }
              });
              setBanned(true);
              setBannedData(item);
            }
          });
          setBannedUsers(userBanned);
          resData?.warnedUsers.forEach((item) => {
            if (item.username === user?.username) {
              setWarned(true);
              setWarnedData(item);
            }
          });
        }
      }
    };
    fetchCourseManagement();
  }, [courseId]);

  useEffect(() => {
    const course = userCourseList?.find((course) => course._id.$oid === courseId);
    setCurrentCourse(course);
  }, [courseId]);

  useEffect(() => {
    const fetchCurrentRoom = async () => {
      console.log("fetching current room", roomId);
      const res = await axiosPrivate.get(getRoomURL + roomId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          setCurrentRoom(resData);
          const course = userCourseList?.find((course) => course._id.$oid === courseId);
          setActiveCourseThread(resData.name.replace(course.name, ""));
          setMessages(resData.messages);
        }
      }
    };
    fetchCurrentRoom();
  }, [roomId]);


  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h1">Q&A</Typography>
      <UserBar />
    </Box>
  );
};

export default QADisplay;
