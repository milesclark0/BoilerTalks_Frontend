import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  courseUsers: any[];
  isCourseSelected: () => boolean;
  drawerWidth: number;
  innerDrawerWidth: number;
};

export const SearchUserBox = ({ courseUsers, isCourseSelected, drawerWidth, innerDrawerWidth }: Props) => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();

  const navigateToProfile = (username: string) => {
    navigate("/profile/" + username);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13 && value != null) {
      console.log(value["username"]);
      navigateToProfile(value["username"]);
    }
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
      sx={{ width: drawerWidth - innerDrawerWidth, "& .Mui-focused": { color: "black"}}}
      renderInput={(params) => <TextField onKeyDown={(e) => handleEnter(e)} {...params} variant="outlined" color="info" label="Search users..." size="small" sx={{
        input: {
          color: "black",
        }
      }} />}
    />
  );
};
