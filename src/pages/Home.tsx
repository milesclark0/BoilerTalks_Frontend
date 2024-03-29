import { useEffect, useState } from "react";
import { APP_STYLES } from "globals/globalStyles";
import SideBar from "component/SideBar/containers/sideBar";
import { Box, Paper, Typography } from "globals/mui";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSockets from "hooks/useSockets";
import { useCourseUsers } from "component/HomePage/hooks/useCourseUsers";
import useUserCourseData from "component/HomePage/hooks/useUserCourseData";
// import UserBar from "../component/HomePage/components/userBar";
import useUserRoomData from "component/HomePage/hooks/useUserRoomData";
import useStore from "store/store";
// import CourseDisplayBar from "../component/ThreadDisplay/CourseDisplayAppBar";
import TabBar from "component/HomePage/components/TabBar";
import CourseDisplayAppBar from "component/ThreadDisplay/components/CourseDisplayAppBar";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useAuth } from "context/context";
import { getProfileURL } from "API/ProfileAPI";
import { Notification } from "globals/types";

const Home = () => {
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  console.log("home rerendered");
  useUserRoomData();
  useSockets();
  const { isUserCourseListLoading, userCourseListError } = useUserCourseData();

  useEffect(() => {
    // retrieve user notifications
    const fetchProfile = async () => {
      const res = await axiosPrivate.get(getProfileURL + user.username);
      // console.log(res);
      if (res.status === 200) {
        if (res.data.statusCode === 200) {
          const retrievedNotifications = res.data.data[0]["notification"];
          const seenNotifications = res.data.data[0]["seenNotification"];
          setNotifications(retrievedNotifications);
          if (JSON.stringify(retrievedNotifications) != JSON.stringify(seenNotifications)) {
            setBadgeCount(1);
          }
        }
      }
    };
    fetchProfile();
    // retrieves every 10 sec
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <SideBar />
      <RoomBox {...{ isUserCourseListLoading, userCourseListError, badgeCount, setBadgeCount, notifications }} />
    </Box>
  );
};

const RoomBox = ({ isUserCourseListLoading, userCourseListError, badgeCount, setBadgeCount, notifications }) => {
  const activeIcon = useStore((state) => state.activeIcon);
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
        {activeIcon.course === "" ? <TabBar {...{ badgeCount, setBadgeCount, notifications }} /> : <CourseDisplayAppBar />}
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
      {userCourseListError ? <Typography variant="h4">Error: {`${userCourseListError}`}</Typography> : null}
    </Box>
  );
};
export default Home;
