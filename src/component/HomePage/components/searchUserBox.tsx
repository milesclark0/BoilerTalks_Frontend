import { Autocomplete, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_STYLES } from "../../../globals/globalStyles";
import { Course } from "../../../globals/types";
import useStore from "../../../store/store";

export const SearchUserBox = () => {
  const [value, setValue] = useState<{ username: string } | null>(null);
  const [courseUsers, currentCourse] = useStore((state) => [state.courseUsers, state.currentCourse]);
  const navigate = useNavigate();

  const navigateToProfile = (username: string) => {
    navigate("/profile/" + username);
  };

  const handleEnter = useCallback(
    (e: { keyCode: number }) => {
      if (e.keyCode === 13 && value != null) {
        console.log(value.username);
        navigateToProfile(value.username);
      }
    },
    [value]
  );

  const isCourseSelected = () => {
    return currentCourse !== null;
  };

  const getOptionLabel = (option: { username: string }) => {
    if (option?.username === undefined) {
      return "";
    } else {
      return option?.username;
    }
  };

  if (isCourseSelected() === false) return null;
  return (
    <Autocomplete
      value={value}
      onChange={(_event, value) => {
        setValue(value);
      }}
      id="user-search-bar"
      options={courseUsers}
      getOptionLabel={getOptionLabel}
      sx={{ color: "white", width: APP_STYLES.DRAWER_WIDTH - APP_STYLES.INNER_DRAWER_WIDTH, "& .Mui-focused": { color: "white" } }}
      renderInput={(params) => (
        <TextField
          onKeyDown={handleEnter}
          {...params}
          variant="outlined"
          color="info"
          label="Search users..."
          size="small"
          sx={{
            input: {
              color: "white",
            },
          }}
        />
      )}
    />
  );
};
