// Display for Q&A
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Message, Room, Question } from "../../globals/types";
import { useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/components/userBar";
import AskQuestionBox from "../ThreadComponents/askQuestionBox";
import { addCourseModsURL, getCourseManagementURL, getCourseModsURL } from "../../API/CourseManagementAPI";
import BanDialog from "../ThreadComponents/BanDialog";
import WarningDialog from "../ThreadComponents/WarningDialog";
import MessageEntry from "../ThreadComponents/MessageEntry";
import ClearIcon from "@mui/icons-material/Clear";
import { Paper } from "@mui/material";
import CourseDisplayAppBar from "./CourseDisplayAppBar";
import { APP_STYLES } from "../../globals/globalStyles";
import useUserRoomData from "../HomePage/hooks/useUserRoomData";
import useStore from "./../../store/store";
import { getRoomURL, getCourseURL } from "../../API/CoursesAPI";
import { updateLastSeenMessageURL } from "../../API/ProfileAPI";
import { useCourseUsers } from "../HomePage/hooks/useCourseUsers";
import { VariableSizeList as List } from "react-window";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  courseUsers: any[];
};

type WarnOrBan = {
  username: string;
  reason: string;
};

type Appeal = {
  username: string;
  response: string;
  reason: string;
  reviewed: boolean;
  unban: boolean;
};

const QADisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { courseId } = useParams();
  const [bannedUsers, setBannedUsers] = useState<string[]>(null);
  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  const [currentCourse, questions, setQuestions, userCourseList, setCurrentCourse, setActiveCourseThread] = useStore(
    (state) => [
      state.currentCourse,
      state.questions,
      state.setQuestions,
      state.userCourseList,
      state.setCurrentCourse,
      state.setActiveCourseThread,
    ]
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
    const fetchQuestions = async () => {
      console.log("fetching current questions for ", courseId);
      const res = await axiosPrivate.get(getCourseURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          const course = userCourseList?.find((course) => course._id.$oid === courseId);
          setActiveCourseThread("Q&A");
          setQuestions(resData.questions);
        }
      }
    };
    fetchQuestions();
  }, [questions]);

  return (
    <Paper sx={{ height: "100%", width: "100%" }} id="room">
      <CourseDisplayAppBar />
      {(banned || warned) && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {banned ? <BanDialog bannedData={bannedData} appealData={appealData} /> : <WarningDialog setWarned={setWarned} warnedData={warnedData} />}
        </Box>
      )}
      {!banned && !warned && (
        <Box sx={{ height: "100%", width: "100%" }}>
          <QuestionListContainer questions={questions} bannedUsers={bannedUsers} />
        </Box>
      )}
    </Paper>
  );
};

const AskQuestionBoxContainer = ({questions}) => {
  return (
    <Box
      sx={{
        height: `${APP_STYLES.APP_BAR_HEIGHT}px`,
        position: "absolute",
        bottom: 20,
        right: `${APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH + 3 * 8}px`,
        left: `${APP_STYLES.DRAWER_WIDTH}px`,
      }}
    >
      <AskQuestionBox questions={questions} />
    </Box>
  );
}

const QuestionListContainer = ({ questions, bannedUsers }) => {
  
}

export default QADisplay;
