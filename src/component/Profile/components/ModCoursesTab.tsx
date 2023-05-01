import React from "react";
import { User, Profile, Course } from "globals/types";
import CourseBox from "./courseCard";
import { Box, Grid, Typography } from "globals/mui";

interface Props {
  viewedUser: User;
  profileInfo: Profile;
  currentUserCourses: Course[];
}
const ModCoursesTab = ({ viewedUser, profileInfo, currentUserCourses }: Props) => {
  const modCourses = currentUserCourses.filter((course) => profileInfo.modThreads.includes(course.name));

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        overflowY: "auto",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        maxHeight: "53vh",
        bgcolor: "primary.main",
        borderRadius: "3%",
      }}
    >
      <Typography variant="h6" sx={{ pb: 1 }}>
        Moderated Courses
      </Typography>
      {modCourses?.length > 0 ? (
        <Grid container spacing={2}>
          {modCourses.map((course) => (
            <Grid item xs={6}>
              <CourseBox course={course} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color={"primary.main"}>None</Typography>
      )}
    </Box>
  );
};

export default ModCoursesTab;
