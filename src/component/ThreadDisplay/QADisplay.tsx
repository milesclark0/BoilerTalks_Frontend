// Display for Q&A
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography, Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Course, Room, Message } from "../../globals/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/components/userBar";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
  courseUsers: any[];
};

const QADisplay = () => {
  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h1">Q&A</Typography>
      <UserBar />
    </Box>
  );
};

export default QADisplay;
