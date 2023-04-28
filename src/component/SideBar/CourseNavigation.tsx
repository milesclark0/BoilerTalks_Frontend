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
  const [ViewReportsOpen, setViewReportsOpen] = useState(false);
  const [ReportsList, setReportsList] = useState<{ username: string; reason: string; numBans: number; numWarns: number }[]>();
  const [PrevBanList, setPrevBanList] = useState<{ username: string; reason: string }[]>();
  const [PrevWarnList, setPrevWarnList] = useState<{ username: string; reason: string }[]>();
  const [newThreadOpen, setNewThreadOpen] = useState(false); //whether a create new thread dialogue is open or not
  const [newThreadValue, setNewThreadValue] = useState(""); //What the new thread name string is
  const { roomId, courseId } = useParams();
  const navigate = useNavigate();
  const { profile, themeSetting } = useAuth();
  const [setCurrentCourse, setCurrentRoom, userRoomsList, activeCourseThread, setActiveCourseThread] = useStore((state) => [
    state.setCurrentCourse,
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
    setReportsOpen,
    ReportsOpen,
    course: course,
  };
  const ViewReportProps = {
    ReportsList,
    PrevBanList,
    PrevWarnList,
    ViewReportsOpen,
    setViewReportsOpen,
    setReportsList,
    setPrevBanList,
    setPrevWarnList,
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

  const handleClickViewReport = () => {
    setViewReportsOpen(true);
  };

  const isActiveCourse = () => {
    return course?._id.$oid === courseId;
  };

  //handler for when a room button is clicked
  const handleClickCourseOrRoom = (buttonRoomId?: string) => {
    // if the user clicks on the same course or room, do nothing
    if (buttonRoomId === roomId) return;
    if (isActiveCourse() && buttonRoomId === undefined) return;
    //if room is clicked
    setCurrentCourse(course);
    if (buttonRoomId) {
      const room = userRoomsList.find((room) => room._id.$oid === buttonRoomId);
      setCurrentRoom(room);
      setActiveCourseThread(room?.name.replace(course?.name, ""));
      navigate(`/home/courses/${course?._id.$oid}/${buttonRoomId}`, {
        replace: true,
      });
      return;
    }
    // set the active course thread and room to the first room in the course
    console.log("courseClicked");
    const room = userRoomsList.find((room) => room._id.$oid === course?.rooms[0][1].$oid);
    setCurrentRoom(room);
    setActiveCourseThread(room.name.replace(course.name, ""));
    navigate(`/home/courses/${course?._id.$oid}/${course?.rooms[0][1].$oid}`, {
      replace: true,
    });
  };

  const staticButtonStyle = () => {
    const color = themeSetting === "light" ? "black" : "white";
    let backgroundColor = themeSetting === "light" ? "lightgrey" : "#424242";
    const filterAmnt = "0";
    const hoverColor = "lightblue";
    return {
      "&:hover": {
        filter: `sepia(${filterAmnt})`,
        backgroundColor: backgroundColor,
      },
      borderColor: color,
      mb: 1,
    };
  };

  const roomButtonStyle = (buttonRoomId?: string) => {
    let backgroundColor = "";
    const staticStyle = staticButtonStyle();
    if (themeSetting === "light") {
      if (roomId === buttonRoomId) backgroundColor = "lightgrey";
    } else {
      if (roomId === buttonRoomId) backgroundColor = "#424242";
    }
    return { ...staticStyle, backgroundColor };
  };

  const threadButtonStyle = (threadName: string, buttonCourseId: string) => {
    const staticStyle = staticButtonStyle();
    let backgroundColor = "";
    if (themeSetting === "light") {
      if (activeCourseThread === threadName && courseId === buttonCourseId) backgroundColor = "lightgrey";
    } else {
      if (activeCourseThread === threadName && courseId === buttonCourseId) backgroundColor = "grey";
    }
    return { ...staticStyle, backgroundColor };
  };

  const courseButtonStyle = () => {
    const staticStyle = staticButtonStyle();
    let backgroundColor = "";
    if (themeSetting === "light") {
      if (isActiveCourse()) backgroundColor = "lightgrey";
    } else {
      if (isActiveCourse()) backgroundColor = "#424242";
    }
    return { ...staticStyle, backgroundColor };
  };

  return (
    <List>
      <ListItem>
        <Button onClick={() => handleClickCourseOrRoom()} variant={isActiveCourse() ? "outlined" : "text"} sx={courseButtonStyle()}>
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
            component={NavLink}
            to={`/home/courses/${course?._id.$oid}/Q&A`}
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
          <Button
            component={NavLink}
            to={`/home/courses/${course?._id.$oid}/Polls`}
            sx={{
              width: "100%",
              ...threadButtonStyle("Poll", course?._id.$oid),
            }}
            onClick={() => {
              setCurrentCourse(course);
              setActiveCourseThread("Poll");
            }}
          >
            <ListItem>
              <Typography variant="body2" noWrap component="div">
                Polls
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
            >
              <ListItem>
                <Typography variant="body2">Appeals</Typography>
              </ListItem>
            </Button>
          )}
          <Button onClick={handleClickRules} sx={{ ...staticButtonStyle(), width: "100%" }}>
            <ListItem>
              <Typography variant="body2">Rules</Typography>
            </ListItem>
          </Button>

          {profile?.modThreads?.includes(course?.name) ? (
            <Button onClick={handleClickNewThread} sx={staticButtonStyle()}>
              <ListItem>
                <Typography variant="body2">New thread</Typography>
              </ListItem>
            </Button>
          ) : (
            <Button onClick={handleClickReport} sx={{ ...staticButtonStyle(), width: "100%" }}>
              <ListItem>
                <Typography variant="body2">Create Report</Typography>
              </ListItem>
            </Button>
          )}
          <AddThreadModal course={course} {...CreateNewThreadProps} />
          <RulesModal {...RulesProps} />
          <SendReportModal {...SendReportsProps} />
          {profile?.modThreads?.includes(course?.name) ? (
            <Button onClick={handleClickViewReport} sx={staticButtonStyle()}>
              <ListItem>
                <Typography variant="body2">View Reports</Typography>
              </ListItem>
            </Button>
          ) : null}
          {profile?.modThreads?.includes(course?.name) && <ViewReportModal {...ViewReportProps} />}
        </List>
      </ListItem>
    </List>
  );
};
