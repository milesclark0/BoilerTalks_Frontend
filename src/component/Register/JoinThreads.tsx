import React, { useState, useEffect } from "react";
import { Box, Button, Autocomplete, TextField, Checkbox, FormHelperText, InputAdornment } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const JoinThreads = ({ setActiveStep }) => {
  // const [courses, setCourses] = useState([]);
  const courses = ["CS180", "CS182", "CS240", "CS250", "CS251", "CS252", "CS307", "CS348", "CS407", "CS408", "CS381", "CS448"];
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // get list of courses from database
  }, []);

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleNext = () => {
    if (selectedCourses.length !== 0) {
      setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    } else {
      setError(true);
    }
  };

  return (
    <Box>
      <Box sx={{ mt: 3 }}>
        <Autocomplete
          multiple
          id="selectCourses"
          options={courses}
          disableCloseOnSelect
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox icon={<CheckBoxOutlineBlankIcon />} checkedIcon={<CheckBoxIcon />} style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          onChange={(event, value) => setSelectedCourses(value)}
          style={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Courses" placeholder="Courses" />}
        />
        <FormHelperText sx={{ fontSize: "14px", marginLeft: 0 }} error={error}>
          {error ? "If you click next, you will need to select course(s). Else just press skip." : ""}
        </FormHelperText>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" sx={{ mr: 1 }} onClick={handleBack}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
          Skip
        </Button>
        <Button onClick={handleNext} variant="contained">
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default JoinThreads;
