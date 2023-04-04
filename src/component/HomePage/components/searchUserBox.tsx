import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_STYLES } from "../../../globals/globalStyles";
import { Course } from "../../../globals/types";
import useStore from "../../../store/store";


export const SearchUserBox = () => {
  const [value, setValue] = useState<{username: string, profilePic: string} | null>(null);
  const [courseUsers, currentCourse] = useStore((state) => [
    state.courseUsers,
    state.currentCourse,
  ]);
  const navigate = useNavigate();

  const navigateToProfile = (username: string) => {
    navigate("/profile/" + username);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && value != null) {
      console.log(value.username);
      navigateToProfile(value.username);
    }
  };

  const isCourseSelected = () => {
    return currentCourse !== null;
  };

  if (isCourseSelected() === false) return null;
  return (
    <Autocomplete
      value={value}
      onChange={(event, value) => {
        setValue(value);
      }}
      id="user-search-bar"
      options={courseUsers}
      getOptionLabel={(option) => {
        if (option?.username === undefined) {
          return "";
        } else {
          return option?.username;
        }
      }}
      sx={{ color: "white", width: APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH, "& .Mui-focused": { color: "white"}}}
      renderInput={(params) => <TextField onKeyDown={(e) => handleEnter(e)} {...params} variant="outlined" color="info" label="Search users..." size="small" sx={{
        input: {
          color: "white",
        }
      }} />}
    />
  );
};
