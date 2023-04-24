import React from "react";
import { Course } from "../../../globals/types";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Login } from "@mui/icons-material";

const CourseBox = ({ course }: { course: Course }) => {
  return (
    <Card sx={{ width: 1, height: 1 }}>
      <CardHeader
        title={course.name}
        subheader={course.semester}
        titleTypographyProps={{
          color: "secondary.main",
        }}
      />
      <CardContent>
        <Typography variant="body2">{course.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default CourseBox;
