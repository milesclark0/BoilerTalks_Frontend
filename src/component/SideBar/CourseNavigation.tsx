import { List, ListItem, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Course, Room } from "../../globals/types";
import AddThreadModal from "./components/addThreadModal";
import SendReportModal from "./components/SendReportModal";
import ViewReportModal from "./components/ViewReportModal";
import { MoreIcon } from "./components/MoreIcon";
import { PinIcon } from "./components/PinIcon";
import RulesModal from "./components/RulesModal";
import { StyledDivider } from "./components/StyledDivider";
import { width } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { getProfileURL } from "../../API/ProfileAPI";
import { useQuery } from "react-query";
import { Profile } from "../../globals/types";
import { NavLink } from "react-router-dom";
import useStore from "../../store/store";

type Props = {
  course: Course;
};

export const CourseNavigation = ({ course }: Props) => {
  const [RulesOpen, setRulesOpen] = useState(false); //whether the rules dialogue is open or not
  const [RulesList, setRulesList] = useState<string[]>([]); //list of rules
  const [ReportsOpen, setReportsOpen] = useState(false); //whether the reports dialogue is open or not
  const [NewReportText, setNewReportText] = useState("");
  const [ReportsList, setReportsList] = useState<{ username: string; reason: string }[]>();
  const [newThreadOpen, setNewThreadOpen] = useState(false); //whether a create new thread dialogue is open or not
  const [newThreadValue, setNewThreadValue] = useState(""); //What the new thread name string is
  const { roomId, courseId } = useParams();
  const navigate = useNavigate();
  const { profile, themeSetting } = useAuth();
  const [
    currentCourse,
    setCurrentCourse,
    currentRoom,
    setCurrentRoom,
    userRoomsList,
    activeCourseThread,
    setActiveCourseThread,
  ] = useStore((state) => [
    state.currentCourse,
    state.setCurrentCourse,
    state.currentRoom,
    state.setCurrentRoom,
    state.userRoomsList,
    state.activeCourseThread,
    state.setActiveCourseThread,
  ]);

  const CreateNewThreadProps = {
    newThreadOpen,
    newThreadValue,
    setNewThreadOpen,
    setNewThreadValue,
  };

  const RulesProps = {
    RulesList,
    RulesOpen,
    setRulesOpen,
    setRulesList,
    course: course,
  };

  const SendReportsProps = {
    setNewReportText,
    NewReportText,
    setReportsOpen,
    ReportsOpen,
    course: course,
  };
  const ViewReportProps = {
    ReportsList,
    ReportsOpen,
    setReportsOpen,
    setReportsList,
    course: course,
  };

  const handleClickRules = () => {
    setRulesOpen(true);
  };

  const handleClickNewThread = () => {
    setNewThreadOpen(true);
  };

  const handleClickReport = () => {
    setReportsOpen(true);
  };

  //handler for when a room button is clicked
  const handleClickCourseOrRoom = (buttonRoomId?: string) => {
    // if the user clicks on the same course or room, do nothing
    console.log(course?.name , currentCourse?.name , buttonRoomId );
    
    if (buttonRoomId === currentRoom?._id.$oid) return;
    if (course?._id.$oid === currentCourse?._id.$oid && buttonRoomId === undefined) return;
    //if room is clicked
    console.log("here");
    
    setCurrentCourse(course);
    if (buttonRoomId) {
      const room = userRoomsList.find((room) => room._id.$oid === buttonRoomId);
      setCurrentRoom(room);
      setActiveCourseThread(room?.name.replace(course?.name, ""));
      navigate(`/home/courses/${course?._id.$oid}/${buttonRoomId}`, { replace: true });
      return;
    }
    // set the active course thread and room to the first room in the course
    console.log("courseClicked");
    const room = userRoomsList.find((room) => room._id.$oid === course?.rooms[0][1].$oid);
    setCurrentRoom(room);
    setActiveCourseThread(room.name.replace(course.name, ""));
    navigate(`/home/courses/${course?._id.$oid}/${course?.rooms[0][1].$oid}`, { replace: true });
  };

  const staticButtonStyle = () => {
    const color = themeSetting === "light" ? "black" : "";
    let backgroundColor = "";
    const filterAmnt = "0";
    const hoverColor = "lightblue";
    return { "&:hover": { filter: `sepia(${filterAmnt})`, backgroundColor: "lightgrey" }, color, borderColor: color, mb: 1, backgroundColor };
  };

  const roomButtonStyle = (buttonRoomId?: string) => {
    let backgroundColor = "";
    const staticStyle = staticButtonStyle();
    if (themeSetting === "light") {
      if (roomId === buttonRoomId) backgroundColor = "lightgrey";
    } else {
      if (roomId === buttonRoomId) backgroundColor = "lightblue";
    }
    return { ...staticStyle, backgroundColor };
  };

  const threadButtonStyle = (threadName: string, buttonCourseId: string) => {
    const staticStyle = staticButtonStyle();
    let backgroundColor = "";
    if (themeSetting === "light") {
      if (activeCourseThread === threadName && courseId === buttonCourseId) backgroundColor = "lightgrey";
    } else {
      if (activeCourseThread === threadName && courseId === buttonCourseId) backgroundColor = "lightblue";
    }
    return { ...staticStyle, backgroundColor };
  };

  const courseButtonStyle = () => {
    const staticStyle = staticButtonStyle();
    let backgroundColor = "";
    if (themeSetting === "light") {
      if (courseId === course?._id.$oid) backgroundColor = "lightgrey";
    } else {
      if (courseId === course?._id.$oid) backgroundColor = "lightblue";
    }
    return { ...staticStyle, backgroundColor };
  };

  // const fetchProfile = async () => {
  //   return await axiosPrivate.get(getProfileURL + user?.username);
  // };

  // const { isLoading, error, data } = useQuery("profile", fetchProfile, {
  //   enabled: true,
  //   staleTime: 1000 * 60, //1 minute
  //   refetchOnMount: "always",
  //   onSuccess: (data) => {
  //     if (data.data.statusCode === 200) {
  //       setProfileInfo(data.data.data[0]);
  //       // console.log(data.data.data);
  //     } else setFetchError(data.data.message);
  //   },
  //   onError: (error: string) => console.log(error),
  // });
  console.log(course?.rooms);

  return (
    <List>
      <ListItem>
        <Button onClick={() => handleClickCourseOrRoom()} variant="outlined" sx={courseButtonStyle()}>
          <Typography variant="body1" noWrap component="div">
            {course?.name}
          </Typography>
        </Button>
        <PinIcon course={course} />
        <MoreIcon course={course} />
      </ListItem>
      <StyledDivider />
      <ListItem>
        <List>
          {course?.rooms.map((room) => {
            return (
              <React.Fragment key={`${course.name}: ${room[0]}`}>
                <Button
                  sx={{
                    width: "100%",
                    ...roomButtonStyle(room[1]?.$oid),
                  }}
                  onClick={() => handleClickCourseOrRoom(room[1]?.$oid)}
                  variant="outlined"
                >
                  <ListItem>
                    <Typography variant="body2" noWrap>
                      {room[0]?.replace(course?.name, "")}
                    </Typography>
                  </ListItem>
                </Button>
              </React.Fragment>
            );
          })}
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              ...threadButtonStyle("Q&A", course?._id.$oid),
            }}
            onClick={() => {
              setCurrentCourse(course);
              setActiveCourseThread("Q&A");
            }}
          >
            <ListItem>
              <Typography variant="body2" noWrap component="div">
                Q&A
              </Typography>
            </ListItem>
          </Button>
          {profile?.modThreads?.includes(course?.name) && (
            <Button
              sx={{
                ...threadButtonStyle("Mod Chat", course?._id.$oid),
                width: "100%",
              }}
              component={NavLink}
              to={`/home/courses/${course?._id.$oid}/${course?.modRoom._id.$oid}`}
              onClick={() => {
                setCurrentCourse(course);
                handleClickCourseOrRoom(course?.modRoom._id.$oid);
                setActiveCourseThread(course?.modRoom.name.replace(course?.name, ""));
              }}
              variant="outlined"
            >
              <ListItem>
                <Typography variant="body2">Mod Chat</Typography>
              </ListItem>
            </Button>
          )}
          {profile?.modThreads?.includes(course?.name) && (
            <Button
              sx={{
                ...threadButtonStyle("Appeals", course?._id.$oid),
                width: "100%",
              }}
              component={NavLink}
              to={`/home/courses/${course?._id.$oid}/Appeals`}
              onClick={() => {
                setCurrentCourse(course);
                setActiveCourseThread("Appeals");
              }}
              variant="outlined"
            >
              <ListItem>
                <Typography variant="body2">Appeals</Typography>
              </ListItem>
            </Button>
          )}
          <Button variant="outlined" onClick={handleClickRules} sx={{ ...staticButtonStyle(), width: "100%" }}>
            <ListItem>
              <Typography variant="body2">Rules</Typography>
            </ListItem>
          </Button>
          <Button variant="outlined" onClick={handleClickReport} sx={{ ...staticButtonStyle(), width: "100%" }}>
            <ListItem>
              <Typography variant="body2">Create Report</Typography>
            </ListItem>
          </Button>
          {profile?.modThreads?.includes(course?.name) && (
            <Button variant="outlined" onClick={handleClickNewThread} sx={staticButtonStyle()}>
              <ListItem>
                <Typography variant="body2">New thread</Typography>
              </ListItem>
            </Button>
          )}
          <AddThreadModal course={course} {...CreateNewThreadProps} />
          <RulesModal {...RulesProps} />
          <SendReportModal {...SendReportsProps} />
          {profile?.modThreads?.includes(course?.name) && <ViewReportModal {...ViewReportProps} />}
        </List>
      </ListItem>
    </List>
  );
};
