import { List, ListItem, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { Course, Room } from "../../../types/types";
import AddThreadModal from "./CourseNavigation/addThreadModal";
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
  const [RulesText, setRulesText] = useState(""); //import backend rules text
  const navigate = useNavigate();
  const { user, profile } = useAuth();
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
    RulesText,
    RulesOpen,
    setRulesOpen,
    setRulesText,
    setUserCourses: props.setUserCourses,
    userCourses: props.userCourses,
    course: course,
  };

  const handleClickRules = () => {
    setRulesOpen(true);
  };

  const handleClickNewThread = () => {
    props.setNewThreadOpen(true);
  };

  const handleClickCourse = () => {
    props.setCurrentCourse(course);
    props.setCurrentRoom(course?.rooms[0]);
    props.setActiveCourseThread(course?.rooms[0].name.replace(course?.name, ""));
    navigate(`/home/courses/${course?._id.$oid}/${course?.rooms[0]._id.$oid}`, { replace: true });
  };

  const buttonStyle = () => {
    const pointerEvents = props.activeIcon?.isActiveCourse ? "none" : "auto";
    const color = "black";
    const backgroundColor = props.currentCourse?.name === course?.name ? "lightblue" : "brown";
    const hoverColor = "lightblue";
    return { pointerEvents,  };
  };

  // const roomButtonStyle = (room: Room) => {
  //   const backgroundColor = props.currentRoom?.name === room.name ? "lightblue" : "white";
  //   const hoverColor = props.currentRoom?.name === room.name ? "lightblue" : "lightgrey";
  //   return { backgroundColor, "&:hover": { backgroundColor: hoverColor } };
  // };

  const threadButtonStyle = (threadName: string) => {
    // console.log("props: " + props.activeCourseThread + "\nthreadName: " + threadName);
    const filterAmnt =
      props.activeCourseThread === threadName
        ? "0"
        : "0";
    return { "&:hover": { filter: `sepia(${filterAmnt})` } };
  };

  const otherButtonStyle = () => {
    const backgroundColor = "white";
    const hoverColor = "lightgrey";
    return { backgroundColor, "&:hover": { backgroundColor: hoverColor } };
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
                      // ...roomButtonStyle(room),
                      ...threadButtonStyle(room?.name.replace(course?.name, "")),
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
            sx={{
              width: "100%",
              vairant: "outlined",
              // ...otherButtonStyle(),
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
                // ...otherButtonStyle(),
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
            </Button>)}
          {profile?.modThreads?.includes(course?.name) && (
            <Button
              sx={{
                // ...otherButtonStyle(),
                ...threadButtonStyle("Appeals"),
                width: "100%",
              }}
              component={NavLink}
              to={`/home/courses/${course?._id.$oid}/Appeals`}
              onClick={() => {
                props.setCurrentCourse(course);
                props.setActiveCourseThread("Appeals");
              }}
            >
              <ListItem>
                <Typography variant="body2">Appeals</Typography>
              </ListItem>
            </Button>
          )}
          <Button
            variant="text"
            onClick={handleClickRules}
            sx={{ ...otherButtonStyle(), width: "100%" }}
          >
            <ListItem>
              <Typography variant="body2">Rules</Typography>
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
        </List>
      </ListItem>
    </List>
  );
};
