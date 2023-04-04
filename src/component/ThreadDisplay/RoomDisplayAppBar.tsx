import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import React from "react";
import { APP_STYLES } from "../../globals/globalStyles";
import { SearchUserBox } from "../HomePage/components/searchUserBox";
import { SemesterSelector } from "../HomePage/components/semesterSelector";
import { Course, Room } from "../../globals/types";
import useStore from "../../store/store";

interface RoomAppBarProps {
  setShowCourses: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoomDisplayAppBar = ({ setShowCourses }: RoomAppBarProps) => {
  const [currentCourse, activeCourseThread, activeIcon] = useStore((state) => [state.currentCourse, state.activeCourseThread, state.activeIcon]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${APP_STYLES.DRAWER_WIDTH}px)`,
        height: APP_STYLES.APP_BAR_HEIGHT,
        alignContent: "center",
      }}
    >
      <Toolbar sx={{ padding: 0 }}>
        <Box sx={{ display: "flex", flexGrow: 1, height: APP_STYLES.APP_BAR_HEIGHT }}>
          <Typography variant="h5" sx={{ p: 2 }} noWrap>
            {currentCourse?.name ? `${currentCourse?.name}: ${activeCourseThread}` : activeIcon.course || "Select a Department or Course"}
          </Typography>

          <Button variant="contained" onClick={() => setShowCourses(true)} sx={{}}>
            Add Courses
          </Button>

          <SemesterSelector />
        </Box>
        <Box>
          <SearchUserBox />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default RoomDisplayAppBar;
