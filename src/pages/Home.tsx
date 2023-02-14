import React from "react";
import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect } from "react";
import useLogout from "../hooks/useLogout";

const Home = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const logout = useLogout();

  const onSignOut = () => {
    logout();
  };

  const onClick = async () => {
    try {
      const response = await axiosPrivate.post("/auth/register");
      console.log(response);
    } catch (error) {
      console.log(error);
      logout();
    }
  };
  return (
    <React.Fragment>
      <h3>{user?.username} is logged in</h3>
      <button onClick={() => onClick()}>Test Private</button>
      <button onClick={() => onSignOut()}>Sign Out</button>
    </React.Fragment>
  );
};

export default Home;
