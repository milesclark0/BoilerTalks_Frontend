import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { unsubscribeFromCourseURL } from "../../../../API/CoursesAPI";
import { Course, User } from "../../../../types/types";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAuth } from "../../../../context/context";

type Props = {
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  distinctDepartments: string[];
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  course: Course;
  distinctCoursesByDepartment: Course[];
};

export const MoreIcon = ({
  setUserCourses,
  userCourses,
  setDistinctDepartments,
  distinctDepartments,
  setActiveIcon,
  activeIcon,
  course,
  distinctCoursesByDepartment,
}: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const api = useAxiosPrivate();
  const { user, setUser } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveServer = async () => {
    const ret = await api.post(unsubscribeFromCourseURL, { courseName: course.name, username: user.username });
    if (ret.data.statusCode == 200) {
      //remove the course from the user's courses states and the user.courses context
      setUser({ ...user, courses: [...user.courses.filter((c) => c != course.name)] });
      setUserCourses([...userCourses.filter((c) => c.name != course.name)]);

      //if the course is the active course, set the active course to nothing
      if (course.name == activeIcon.course) {
        setActiveIcon({ course: "", isActiveCourse: false });
      } else if (distinctCoursesByDepartment?.length == 1) {
        //if the course is the last course in the department, set the active course to nothing
        setDistinctDepartments([...distinctDepartments.filter((d) => d != course.department)]);
        setActiveIcon({ course: "", isActiveCourse: false });
        console.log([...distinctDepartments.filter((d) => d != course.department)]);
      } else {
        //trigger a rerender of the course icons
        setActiveIcon({ course: distinctCoursesByDepartment[0].department, isActiveCourse: false });
      }
      setUser({ ...user, activeCourses: user?.activeCourses?.filter((c) => c != course.name) });
      setUserCourses([...userCourses.filter((c) => c.name != course.name)]);
    } else {
      alert("Error leaving server");
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "20ch",
            maxHeight: 48 * 4.5,
            bgcolor: "background.paper",
          },
        }}
      >
        <MenuItem onClick={handleLeaveServer}>Leave Server</MenuItem>
        {/* {add more options for mods and what not} */}
      </Menu>
    </React.Fragment>
  );
};
