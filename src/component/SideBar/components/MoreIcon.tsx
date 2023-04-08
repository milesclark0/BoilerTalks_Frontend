import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import React, {useState} from "react";
import { unsubscribeFromCourseURL } from "../../../API/CoursesAPI";
import { Course, User } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAuth } from "../../../context/context";
import useStore from "../../../store/store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPreference from "../../Notification/NotificationPreference";

type Props = {
  course: Course;
};

export const MoreIcon = ({ course }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openNoti, setOpenNoti] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const api = useAxiosPrivate();
  const { user, setUser } = useAuth();
  const [
    activeIcon,
    setActiveIcon,
    distinctCoursesByDepartment,
    updateDistinctCoursesByDepartment,
  ] = useStore((state) => [
    state.activeIcon,
    state.setActiveIcon,
    state.distinctCoursesByDepartment,
    state.updateDistinctCoursesByDepartment,
  ]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNotification = () => {
    setOpenNoti(true);
  }

  const handleLeaveServer = async () => {
    const ret = await api.post(unsubscribeFromCourseURL, {
      courseName: course.name,
      username: user.username,
    });
    if (ret.data.statusCode == 200) {
      //if the course is the active course, set the active course to home icon
      if (course.name == activeIcon.course) {
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
        <MenuItem onClick={handleOpenNotification}>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          Notification
        </MenuItem>
        <MenuItem onClick={handleLeaveServer}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          Leave Server
          {/* <Typography>Leave Server</Typography> */}
        </MenuItem>
        {/* {add more options for mods and what not} */}
      </Menu>
      <NotificationPreference openNoti={openNoti} setOpenNoti={setOpenNoti} courseName={course.name}/>
    </React.Fragment>
  );
};
