import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import SideBar from "../component/HomePage/components/sideBar";
import { Box, Button } from "@mui/material";
import { Course } from "../globals/types";

const Policies = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  //const [showCourses, setShowCourses] = useState(false);
  //const [activeIcon, setActiveIcon] = useState<{ course: String; isActiveCourse: boolean }>({ course: "", isActiveCourse: false });

  const policiesProps = {
    user,
    //activeIcon,
    //setActiveIcon,
    mainMargin: 100,
    innerDrawerWidth: 85,
  };

  return (
    <Box sx={{ display: "flex", margin: `${policiesProps.mainMargin}px` }}>
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 8,
          height: "75%",
          width: "55%",
          borderRadius: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "initial",
          flexDirection: "column",
          margin: "auto",
          padding: "1%",
          // "& > :not(style)": { m: 1 },
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            boxShadow: 0,
            height: "100%",
            margin: "0px",
          }}
          component="form"
          noValidate
          autoComplete="off"
        >
          <h1>Terms of Service:</h1>
          <p>
            <h4>
              This document and the other documents that we reference below make up our house rules, or what we officially call our Terms of Use (the
              “Terms” for short).
            </h4>
            The Terms are a legally binding contract between you and BoilerTalks. Please note that Section 11. Disputes with BoilerTalks, contains an
            arbitration clause and class action waiver. By agreeing to the Terms, you agree to resolve all disputes through binding individual
            arbitration, which means that you waive any right to have those disputes decided by a judge or jury, and that you waive your right to
            participate in class actions, class arbitrations, or representative actions. * This contract sets out your rights and responsibilities
            when you use BoilerTalks.com, Pattern by BoilerTalks, our mobile apps, and the other services provided by BoilerTalks (we’ll refer to all
            of these collectively as our “Services”), so please read it carefully. By using any of our Services (even just browsing one of our
            websites), you’re agreeing to the Terms. If you don’t agree with the Terms, you may not use our Services.
          </p>
        </Box>
      </Box>
    </Box>
  );
};

export default Policies;
