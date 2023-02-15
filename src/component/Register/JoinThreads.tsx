import React, { useState, useEffect } from "react";
import { Box, Button, Autocomplete, TextField, Checkbox, FormHelperText, InputAdornment } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import useAxiosPrivate from './../../hooks/useAxiosPrivate';

const JoinThreads = ({ setActiveStep , setUserCourses}) => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const axiosPrivate = useAxiosPrivate()

  // get list of courses from database
  const getCourses = async () => {
    try {
      const res = await axiosPrivate.get("/courses/getAllCourses");
      console.log(res.data);
      setCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleNext = () => {
      setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  return (
    <Box>
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
          onChange={(event, value) => setUserCourses(value)}
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
