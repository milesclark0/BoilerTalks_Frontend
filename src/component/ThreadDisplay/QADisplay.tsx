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
import QuestionEntry from "../ThreadComponents/questionEntry";

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
  const [roomId, setRoomId ] = useState<string>(null);
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
    setRoomId("Q&A");
  }, [roomId])

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("fetching current questions for ", courseId);
      const res = await axiosPrivate.get(getCourseURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          setActiveCourseThread("Q&A");
          setQuestions(resData.questions);
        }
      }
    };
    fetchQuestions();
  }, [courseId]);

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
  const [currentCourse] = useStore((state) => [state.currentCourse]);
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
      <AskQuestionBox questions={questions} course={currentCourse} />
    </Box>
  );
};

const QuestionListContainer = ({ questions, bannedUsers }) => {

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <AskQuestionBoxContainer questions={questions} />
      <Box
        id="message-container"
        sx={{
          p: APP_STYLES.DEFAULT_PADDING,
          width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
          maxHeight: `calc(100% - ${APP_STYLES.APP_BAR_HEIGHT * 2 + 30}px)`,
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          scrollBehavior: "smooth",
        }}
        className="scrollBar"
      >
        <QuestionsList questions={questions} />
      </Box>
      {/* <UserBar /> */}
    </Box>
  );
};

const QuestionsList = ({ questions }) => {
  const { profile } = useAuth();
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const axiosPrivate = useAxiosPrivate();
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      //scroll to bottom and resize list entries
      listRef.current.resetAfterIndex(0, true);
      listRef.current.scrollToItem(questions.length - 1, { align: "bottom" });
    }
  }, [questions[0]]);

  const getItemSize = (index: number) => {
    const question = questions[index];
    // Compute the height of the message based on its contents
    // You can use any algorithm that suits your needs
    // Here's an example based on the message text length
    const lineHeight = 40; // You can adjust this value to match your font size
    const titleHeight = 60 //tentative, see how large the title text is
    const linesCount = Math.ceil(question?.content.length / 140); // Break lines every 50 characters
    var responseLineCount = 0;
    question?.responses.forEach((response) => {
      responseLineCount += Math.ceil(response.length / 140);
    })

    const finalHeight = linesCount * lineHeight + 40 + titleHeight + responseLineCount * lineHeight; // Add some extra space for the message container
    // console.log(index, linesCount, getDividerHeight(index), finalHeight);
    return finalHeight;
  };

  const Row = ({ index, style }) => {
    const question = questions[index];
    const QuestionEntryProps = {
      questions,
      question,
      index,
      course: currentCourse,
    };
    // Render a message entry using the message data
    return (
      <div key={question.username} style={{ ...style, scrollBehavior: "smooth" }}>
        {/* <ConditionalLineBreak index={index} /> */}
        <QuestionEntry {...QuestionEntryProps}
        />
      </div>
    );
  };

  return (
    <div>
      {questions?.length > 0 ? (
        <List
          height={850} // set the height of the list
          itemCount={questions?.length} // set the number of items in the list
          itemSize={getItemSize}
          estimatedItemSize={100} // set the height of each item in the list
          width="100%" // set the width of the list
          ref={listRef}
          style={{ overflowX: "hidden" }}
          className="scrollBar"
        >
          {Row}
        </List>
      ) : (
        <Box>{questions? <Typography variant="h6">No questions yet!</Typography> : <Typography>Loading...</Typography>}</Box>
      )}
    </div>
  );
}

export default QADisplay;
