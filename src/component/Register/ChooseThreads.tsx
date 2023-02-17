import React, { useState, useEffect } from "react";
import { Box, Button, Autocomplete, TextField, Checkbox, FormHelperText, InputAdornment } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import useAxiosPrivate from "./../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { getAllCoursesURL } from "../../API/CoursesAPI";

const ChooseThreads = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const api = useAxiosPrivate();
  const navigate = useNavigate();

  // get list of courses from database
  const getCourses = async () => {
    try {
      const res = await api.get(getAllCoursesURL);
      console.log(res.data);
      setCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const navigateHome = () => {
    navigate("/home")
  };

  const handleNext = () => {
    // check if anything is selected
    // if nothing is selected, display error
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ mt: 3 }}>
        <Autocomplete
          multiple
          id="selectCourses"
          options={courses}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name + " - " + option.semester}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox icon={<CheckBoxOutlineBlankIcon />} checkedIcon={<CheckBoxIcon />} style={{ marginRight: 8 }} checked={selected} />
              {option.name + " - " + option.semester}
            </li>
          )}
          onChange={(e, value) => setCourses(value)}
          style={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Courses" placeholder="Courses" />}
        />
        <FormHelperText sx={{ fontSize: "14px", marginLeft: 0 }} error={error}>
          {error ? "If you click next, you will need to select course(s). Else just press skip." : ""}
        </FormHelperText>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button color="inherit" onClick={navigateHome} sx={{ mr: 1 }}>
          Skip
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ChooseThreads;
