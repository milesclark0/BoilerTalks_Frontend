import React from "react";
import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import useLogout from "../hooks/useLogout";
import SearchCourse from "../component/HomePage/searchCourse";
import Modal from "@mui/material/Modal";

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
    <React.Fragment>
      <h3>{user?.username} is logged in</h3>
      <button onClick={() => onClick()}>Test Private</button>
      <button onClick={() => onSignOut()}>Sign Out</button>
      <button onClick={() => setShowCourses(true)}>Add Courses</button>
      <SearchCourse showCourses={showCourses} setShowCourses={setShowCourses}/>
    </React.Fragment>
  );
};

export default Home;
