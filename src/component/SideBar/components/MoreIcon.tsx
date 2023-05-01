import { IconButton, ListItemIcon, Menu, MenuItem } from "globals/mui";
import React, { useState } from "react";
import { Course, User } from "globals/types";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPreference from "component/Notification/NotificationPreference";
import LeaveServer from "component/ThreadDisplay/components/LeaveServer";

type Props = {
  course: Course;
};

export const MoreIcon = ({ course }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openNoti, setOpenNoti] = useState<boolean>(false);
  const [openLeave, setOpenLeave] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNotification = () => {
    setOpenNoti(true);
  };

  const handleOpenLeave = () => {
    setOpenLeave(true);
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
        <MenuItem onClick={handleOpenLeave}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          Leave Server
        </MenuItem>
        {/* {add more options for mods and what not} */}
      </Menu>
      <NotificationPreference openNoti={openNoti} setOpenNoti={setOpenNoti} courseName={course.name} />
      <LeaveServer course={course} setAnchorEl={setAnchorEl} openLeave={openLeave} setOpenLeave={setOpenLeave} />
    </React.Fragment>
  );
};
