import { List, ListItem, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { Course, Room } from "../../../types/types";
import AddThreadModal from "./CourseNavigation/addThreadModal";
import SendReportModal from "./CourseNavigation/SendReportModal";
import ViewReportModal from "./CourseNavigation/ViewReportModal";
import { MoreIcon } from "./CourseNavigation/MoreIcon";
import { PinIcon } from "./CourseNavigation/PinIcon";
import RulesModal from "./CourseNavigation/RulesModal";
import { StyledDivider } from "../StyledDivider";
import { width } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/context";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { getProfileURL } from "../../../API/ProfileAPI";
import { useQuery } from "react-query";
import { Profile } from "../../../types/types";
import { NavLink } from "react-router-dom";

type Props = {
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  distinctDepartments: string[];
  distinctCoursesByDepartment: Course[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  newThreadOpen: boolean;
  setNewThreadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newThreadValue: string;
  setNewThreadValue: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setActiveCourseThread: React.Dispatch<React.SetStateAction<string>>;
  activeCourseThread: string;
};

export const CourseNavigation = ({ course, ...props }: Props) => {
  const [RulesOpen, setRulesOpen] = useState(false); //whether the rules dialogue is open or not
  const [RulesList, setRulesList] = useState<string[]>([]); //list of rules
  const [ReportsOpen, setReportsOpen] = useState(false); //whether the reports dialogue is open or not
  const [NewReportText, setNewReportText] = useState("");
  const [ReportsList, setReportsList] = useState<{username: string, reason: string}[]>();
  const navigate = useNavigate();
  const { user, profile, themeSetting } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [fetchError, setFetchError] = useState("");
  // const [profileInfo, setProfileInfo] = useState<Profile>(null);

  const MoreIconProps = {
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
    setDistinctDepartments: props.setDistinctDepartments,
    distinctDepartments: props.distinctDepartments,
    setActiveIcon: props.setActiveIcon,
    activeIcon: props.activeIcon,
    course,
    distinctCoursesByDepartment: props.distinctCoursesByDepartment,
  };

  const CreateNewThreadProps = {
    newThreadOpen: props.newThreadOpen,
    newThreadValue: props.newThreadValue,
    setNewThreadOpen: props.setNewThreadOpen,
    setNewThreadValue: props.setNewThreadValue,
    currentCourse: props.currentCourse,
    setCurrentCourse: props.setCurrentCourse,
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
  };

  const RulesProps = {
    RulesList,
    RulesOpen,
    setRulesOpen,
    setRulesList,
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
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
    props.setNewThreadOpen(true);
  };

  const handleClickReport = () => {
    setReportsOpen(true);
  };

  const handleClickCourse = () => {
    props.setCurrentCourse(course);
    props.setCurrentRoom(course?.rooms[0]);
    props.setActiveCourseThread(course?.rooms[0].name.replace(course?.name, ""));
    navigate(`/home/courses/${course?._id.$oid}/${course?.rooms[0]._id.$oid}`, { replace: true });
  };

  const buttonStyle = () => {
    const color = themeSetting === "light" ? "black" : "";
    const filterAmnt = "0";

    const hoverColor = "lightblue";
    return { "&:hover": { filter: `sepia(${filterAmnt})` }, color, borderColor: color, mb: 1 };
  };

  // const roomButtonStyle = (room: Room) => {
  //   const backgroundColor = props.currentRoom?.name === room.name ? "lightblue" : "white";
  //   const hoverColor = props.currentRoom?.name === room.name ? "lightblue" : "lightgrey";
  //   return { backgroundColor, "&:hover": { backgroundColor: hoverColor } };
  // };

  const threadButtonStyle = (threadName: string) => {
    // console.log("props: " + props.activeCourseThread + "\nthreadName: " + threadName);
    const color = themeSetting === "light" ? "black" : "";
    const filterAmnt = "0";
    const hoverColor = "lightblue";
    return { "&:hover": { filter: `sepia(${filterAmnt})` }, color, borderColor: color, mb: 1};
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

  return (
    <List>
      <ListItem>
        <Button onClick={handleClickCourse} variant="outlined" sx={buttonStyle()}>
          <Typography variant="body1" noWrap component="div">
            {course?.name}
          </Typography>
        </Button>
        <PinIcon course={course} />
        <MoreIcon course={course} {...MoreIconProps} />
      </ListItem>
      <StyledDivider />
      <ListItem>
        <List>
          {course?.rooms
            ?.sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((room) => {
              return (
                <React.Fragment key={`${course.name}: ${room?.name}`}>
                  <Button
                    sx={{
                      width: "100%",
                      ...buttonStyle(),
                    }}
                    component={NavLink}
                    to={`/home/courses/${course?._id.$oid}/${room?._id.$oid}`}
                    onClick={() => {
                      if (props.currentRoom?._id.$oid !== room?._id.$oid) {
                        props.setCurrentCourse(course);
                        props.setCurrentRoom(room);
                        props.setActiveCourseThread(room?.name.replace(course?.name, ""));
                        // navigate(`/home/courses/${course._id.$oid}/${room._id.$oid}`, { replace: true });
                      }
                    }}
                    variant="outlined"
                  >
                    <ListItem>
                      <Typography variant="body2" noWrap>
                        {room?.name?.replace(course?.name, "")}
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
              ...threadButtonStyle("Q&A"),
            }}
            component={NavLink}
            to={`/home/courses/${course?._id.$oid}/Q&A`}
            onClick={() => {
              props.setCurrentCourse(course);
              props.setActiveCourseThread("Q&A");
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
                ...threadButtonStyle("Mod Chat"),
                width: "100%",
              }}
              component={NavLink}
              to={`/home/courses/${course?._id.$oid}/${course?.modRoom._id.$oid}`}
              onClick={() => {
                props.setCurrentCourse(course);
                props.setCurrentRoom(course?.modRoom);
                props.setActiveCourseThread(course?.modRoom.name.replace(course?.name, ""));
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
                ...threadButtonStyle("Appeals"),
                width: "100%",
              }}
              component={NavLink}
              to={`/home/courses/${course?._id.$oid}/Appeals`}
              onClick={() => {
                props.setCurrentCourse(course);
                props.setActiveCourseThread("Appeals");
              }}
              variant="outlined"
            >
              <ListItem>
                <Typography variant="body2">Appeals</Typography>
              </ListItem>
            </Button>
          )}
          <Button variant="outlined" onClick={handleClickRules} sx={{ ...buttonStyle(), width: "100%" }}>
            <ListItem>
              <Typography variant="body2">Rules</Typography>
            </ListItem>
          </Button>
          <Button
            variant="outlined"
            onClick={handleClickReport}
            sx={{ ...buttonStyle(), width: "100%" }}
          >
            <ListItem>
              <Typography variant="body2">Create Report</Typography>
            </ListItem>
          </Button>
          {profile?.modThreads?.includes(course?.name) && (
            <Button variant="outlined" onClick={handleClickNewThread}>
              <ListItem>
                <Typography variant="body2">New thread</Typography>
              </ListItem>
            </Button>
          )}
          <AddThreadModal course={course} {...CreateNewThreadProps} />
          <RulesModal {...RulesProps} />
          <SendReportModal {...SendReportsProps} />
          {profile?.modThreads?.includes(course?.name) && (
            <ViewReportModal {...ViewReportProps} />
          )}
        </List>
      </ListItem>
    </List>
  );
};
