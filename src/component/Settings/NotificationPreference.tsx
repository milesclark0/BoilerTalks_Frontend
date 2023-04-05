import React, {useEffect} from 'react'
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Drawer,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const NotificationPreference = () => {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    // retrieve user notification preference
  }, []);
  
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {courses?.map((course) => {
        return (
          <div>{course}</div>
        );
      })}
    </Box>
  );
}

export default NotificationPreference