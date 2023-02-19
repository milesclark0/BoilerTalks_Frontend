import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import SearchCourse from "../component/HomePage/searchCourse";
import SideBar from "../component/HomePage/sideBar";
import { Box } from "@mui/material";

const Home = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();
  const [showCourses, setShowCourses] = useState(false);
  
  const onSignOut = () => {
    logout();
  };



  const onClick = async () => {
    try {
      const response = await axiosPrivate.post("/auth/register");
      console.log(response);
    } catch (error) {
      console.log(error);
      //logout();
    }
  };
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar user={user}/>
      <button onClick={() => onSignOut()}>Sign Out</button>
      <button onClick={() => setShowCourses(true)}>Add Courses</button>
      <SearchCourse showCourses={showCourses} setShowCourses={setShowCourses} />
    </Box>
  );
};

export default Home;
