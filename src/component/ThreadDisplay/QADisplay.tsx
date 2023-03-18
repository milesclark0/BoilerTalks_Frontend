import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography, Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Course, Room, Message } from "../../types/types";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import UserBar from "../HomePage/userBar";

type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course;
};

const QADisplay = () => {
  const { roomProps } = useOutletContext<{
    roomProps: Props;
  }>();
  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h1">Q&A</Typography>
      <UserBar {...roomProps} />
    </Box>
  );
};

export default QADisplay;
