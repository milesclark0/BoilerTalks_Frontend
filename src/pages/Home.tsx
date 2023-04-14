import { useEffect, useState } from "react";
import { APP_STYLES } from "../globals/globalStyles";
import SideBar from "../component/HomePage/components/sideBar";
import { Box, Paper, Typography } from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSockets from "../hooks/useSockets";
import { useCourseUsers } from "../component/HomePage/hooks/useCourseUsers";
import useUserCourseData from "../component/HomePage/hooks/useUserCourseData";
// import UserBar from "../component/HomePage/components/userBar";
import useUserRoomData from "../component/HomePage/hooks/useUserRoomData";
import useStore from "../store/store";
// import CourseDisplayBar from "../component/ThreadDisplay/CourseDisplayAppBar";
import TabBar from "../component/HomePage/components/TabBar";
import CourseDisplayAppBar from "../component/ThreadDisplay/CourseDisplayAppBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAuth } from "../context/context";
import { getProfileURL } from "../API/ProfileAPI";
import { Notification } from "../globals/types";

const Home = () => {
  const [activeIcon] = useStore((state) => [state.activeIcon]);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  console.log("home rerendered");

  const navigate = useNavigate();
  useSockets();
  const { courseId, roomId } = useParams();

  const getRoomFromUrl = () => {
    const room = userRoomsList?.find((room) => room._id.$oid === roomId);
    return room;
  };
  const getCourseFromUrl = () => {
    const course = userCourseList?.find((course) => course._id.$oid === courseId);
    return course;
  };

  const { userCourseList, isUserCourseListLoading, userCourseListError } = useUserCourseData({
    getCourseFromUrl,
    getRoomFromUrl,
  });
  const { userRoomsList, isUserRoomsListLoading, userRoomsListError } = useUserRoomData();
  useCourseUsers();
  useEffect(() => {
    //runs when SideBar icon is clicked
    console.log("activeIcon changed: ", activeIcon);

    if (activeIcon.isActiveCourse) {
      //if the icon is a course, not a department
      userCourseList.forEach((course) => {
        if (course.name === activeIcon.course) {
          navigate(`/home/courses/${course._id.$oid}/${course?.rooms[0][1].$oid}`, {
            replace: true,
          });
        }
      });
    } else {
      //if the icon is a department or is not set
      if (activeIcon.course === "") {
        navigate(`/home`, {
          replace: true,
        });
      } else {
        navigate(`/home/courses`, {
          replace: true,
        });
      }
    }
  }, [activeIcon]);

  // useEffect(() => {
  //   // sets current course, room, and activeCourseThread based on url if present else sets them to null
  //   setCurrentCourse(getCourseFromUrl() || null);
  //   setCurrentRoom(getRoomFromUrl() || null);
  //   setActiveCourseThread(getCourseFromUrl()?.rooms[0][0] || "");
  // }, []);

  useEffect(() => {
    // retrieve user notifications
    const fetchProfile = async () => {
      const res = await axiosPrivate.get(getProfileURL + user.username);
      // console.log(res);
      if (res.status === 200) {
        if (res.data.statusCode === 200) {
          const retrievedNotifications = res.data.data[0]["notification"]
          const seenNotifications = res.data.data[0]["seenNotification"]
          setNotifications(retrievedNotifications)
          if (JSON.stringify(retrievedNotifications) != JSON.stringify(seenNotifications)) {
            setBadgeCount(1);
          }
        }
      }
    };
    fetchProfile();
    // retrieves every 20 sec
    const interval = setInterval(() => {
      fetchProfile();
    }, 20000);

    return () => clearInterval(interval);
  }, []);


  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <SideBar />
      <RoomBox {...{ isUserCourseListLoading, userCourseListError, activeIcon, badgeCount, setBadgeCount, notifications }} />
    </Box>
  );
};

const RoomBox = ({
  isUserCourseListLoading,
  userCourseListError,
  activeIcon,
  badgeCount,
  setBadgeCount,
  notifications,
}) => {
  return !isUserCourseListLoading && !userCourseListError ? (
    <Box
      sx={{
        pl: `${APP_STYLES.DRAWER_WIDTH}px`,
        width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
      }}
      id="home"
    >
      <Paper
        sx={{
          pt: `${APP_STYLES.APP_BAR_HEIGHT}px`,
          height: `calc(100% - ${APP_STYLES.APP_BAR_HEIGHT}px)`,
          // width: `calc(100% - ${drawerWidth}px)`,
          width: "100%",
          borderRadius: 0,
        }}
        id="threads"
      >
        {/* renders display for the current room/thread etc */}
        <Outlet />
        {/* <UserBar /> */}
        {activeIcon.course === "" ? (
          <TabBar {...{ badgeCount, setBadgeCount, notifications }} />
        ) : (
          <CourseDisplayAppBar />
        )}
      </Paper>
    </Box>
  ) : (
    <Box
      sx={{
        padding: APP_STYLES.DEFAULT_PADDING,
        paddingLeft: `${APP_STYLES.DRAWER_WIDTH + 4 * APP_STYLES.DEFAULT_PADDING}px`,
      }}
    >
      {isUserCourseListLoading ? <Typography variant="h4">Loading...</Typography> : null}
      {userCourseListError ? (
        <Typography variant="h4">Error: {`${userCourseListError}`}</Typography>
      ) : null}
    </Box>
  );
};
export default Home;
