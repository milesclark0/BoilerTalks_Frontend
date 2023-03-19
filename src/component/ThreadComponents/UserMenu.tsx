// This file is used for menu dropdown in chat room
import { Menu, MenuItem, IconButton, Avatar, Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { StyledDivider } from "../SideBar/StyledDivider";
import { Course } from "../../types/types";
import WarnPrompt from "./WarnPrompt";
import BanPrompt from "./BanPrompt";

type Props = {
  username: string;
  course: Course | null;
};

const UserMenu = ({ username, course }: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);
  const { profile } = useAuth();
  const [openWarningPrompt, setOpenWarningPrompt] = useState<boolean>(false);
  const [openBanPrompt, setOpenBanPrompt] = useState<boolean>(false);

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    // console.log(username);
    navigate("/profile/" + username);
  };

  const handleOpenWarningPrompt = () => {
    setOpenWarningPrompt(true);
  };

  const handleOpenBanPrompt = () => {
    setOpenBanPrompt(true);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleUserClick} size="small">
        {/* get specific user profile picture */}
        <Avatar />
      </IconButton>
      <Menu
        open={openUserMenu}
        anchorEl={anchorEl}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0.32))",
            outline: "2px solid black",
          },
        }}
      >
        <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center", m: 0 }}>
          Profile
        </MenuItem>
        {profile?.modThreads.includes(course?.name) && profile.username !== username && (
          <Box>
            <StyledDivider />
            <MenuItem onClick={handleOpenWarningPrompt}>Warn</MenuItem>
            <MenuItem onClick={handleOpenBanPrompt}>Ban</MenuItem>
          </Box>
        )}
      </Menu>
      <WarnPrompt
        openWarningPrompt={openWarningPrompt}
        setOpenWarningPrompt={setOpenWarningPrompt}
        username={username}
      />
      <BanPrompt openBanPrompt={openBanPrompt} setOpenBanPrompt={setOpenBanPrompt} username={username}/>
    </React.Fragment>
  );
};

export default UserMenu;
