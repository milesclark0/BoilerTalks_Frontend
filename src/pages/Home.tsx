import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import SearchCourse from "../component/HomePage/searchCourse";
import SideBar from "../component/HomePage/sideBar";
import { Box, Button } from "@mui/material";
import { Course } from "../types/types";

const Home = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [showCourses, setShowCourses] = useState(false);
  const [activeIcon, setActiveIcon] = useState<{ course: String; isActiveCourse: boolean }>({ course: "", isActiveCourse: false });

  const sideBarProps = {
    user,
    activeIcon,
    setActiveIcon,
    drawerWidth: 300,
    innerDrawerWidth: 85,
  };

  const searchCourseProps = {
    user,
    showCourses,
    setShowCourses,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar {...sideBarProps} />
      <SearchCourse {...searchCourseProps} />
      <Box sx={{ marginLeft: `${sideBarProps.drawerWidth}px`}}>
        <Button onClick={() => setShowCourses(true)}>Add Courses</Button>
      </Box>
    </Box>
  );
};

export default Home;
