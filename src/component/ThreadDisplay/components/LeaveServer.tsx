import React from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useAuth } from "context/context";
import { unsubscribeFromCourseURL } from "API/CoursesAPI";
import useStore from "store/store";
import { Course } from "globals/types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "globals/mui";

type Props = {
  course: Course;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  openLeave: boolean;
  setOpenLeave: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveServer = ({ course, setAnchorEl, openLeave, setOpenLeave }: Props) => {
  const [activeIcon, setActiveIcon, distinctCoursesByDepartment, updateDistinctCoursesByDepartment] = useStore((state) => [
    state.activeIcon,
    state.setActiveIcon,
    state.distinctCoursesByDepartment,
    state.updateDistinctCoursesByDepartment,
  ]);

  const api = useAxiosPrivate();
  const { user } = useAuth();

  const handleLeaveServer = async () => {
    const ret = await api.post(unsubscribeFromCourseURL, {
      courseName: course?.name,
      username: user.username,
    });
    if (ret.data.statusCode == 200) {
      //if the course is the active course, set the active course to home icon
      if (course?.name == activeIcon.course) {
        setActiveIcon("", false);
      } else if (distinctCoursesByDepartment?.length == 1) {
        //if the course is the last course in the department, set the active course to nothing
        setActiveIcon("", false);
      }
      //update distinct courses by department
      updateDistinctCoursesByDepartment(course, "remove");
    } else {
      alert("Error leaving server");
    }
    handleCloseAnchor();
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleLeaveClose = () => {
    setOpenLeave(false);
  };

  return (
    <Dialog open={openLeave}>
      <DialogTitle>Leave {course?.name}</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to leave {course?.name}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLeaveClose} autoFocus variant="contained">
          No
        </Button>
        <Button onClick={handleLeaveServer} variant="outlined">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveServer;
