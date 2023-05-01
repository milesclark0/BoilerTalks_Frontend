// This file is used for menu dropdown in chat room
import { Menu, MenuItem, IconButton, Avatar, Box } from "globals/mui";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/context";
import { StyledDivider } from "component/SideBar/components/StyledDivider";
import { Course } from "globals/types";
import WarnPrompt from "./WarnPrompt";
import BanPrompt from "./BanPrompt";
import SendReportModal from "component/SideBar/components/SendReportModal";

type Props = {
  username: string;
  course: Course | null;
  openUserMenu: boolean;
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
};

const UserMenu = ({ username, course, openUserMenu, anchorEl, setAnchorEl }: Props) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [openWarningPrompt, setOpenWarningPrompt] = useState<boolean>(false);
  const [openBanPrompt, setOpenBanPrompt] = useState<boolean>(false);
  const [ReportsOpen, setReportsOpen] = useState<boolean>(false);

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const reportProps = {
    ReportsOpen,
    setReportsOpen,
    course,
    initialReason: "Student",
    recipient: username,
  };

  const navigateToProfile = () => {
    // console.log(username);
    navigate("/profile/" + username);
  };

  const reportUser = () => {
    handleUserMenuClose();
    setReportsOpen(true);
  };

  const handleOpenWarningPrompt = () => {
    setOpenWarningPrompt(true);
  };

  const handleOpenBanPrompt = () => {
    setOpenBanPrompt(true);
  };

  return (
    <React.Fragment>
      <SendReportModal {...reportProps} />
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
        {profile?.modThreads.includes(course?.name) && profile.username !== username ? (
          <Box>
            <StyledDivider />
            <MenuItem onClick={handleOpenWarningPrompt}>Warn</MenuItem>
            <MenuItem onClick={handleOpenBanPrompt}>Ban</MenuItem>
          </Box>
        ) : (
          username !== profile?.username && (
            <MenuItem onClick={reportUser} sx={{ justifyContent: "center", m: 0 }}>
              Report
            </MenuItem>
          )
        )}
      </Menu>
      <WarnPrompt openWarningPrompt={openWarningPrompt} setOpenWarningPrompt={setOpenWarningPrompt} username={username} />
      <BanPrompt openBanPrompt={openBanPrompt} setOpenBanPrompt={setOpenBanPrompt} username={username} />
    </React.Fragment>
  );
};

export default UserMenu;
