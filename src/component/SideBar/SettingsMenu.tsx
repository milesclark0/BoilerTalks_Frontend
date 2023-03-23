import { Menu, MenuItem } from "@mui/material";
import React from "react";
import useLogout from "../../hooks/useLogout";
import { StyledDivider } from "./StyledDivider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { Room } from "../../types/types";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  currentRoom: Room | null;
};

export const SettingsMenu = ({ anchorEl, setAnchorEl, currentRoom }: Props) => {
  const settingsOpen = Boolean(anchorEl);
  const logout = useLogout();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const navigateToSettings = () => {
    navigate("/settings");
  };

  const navigateToAbout = () => {
    navigate("/about");
  };

  const navigateToProfile = () => {
    navigate("/profile/" + user.username);
  };

  return (
    <Menu open={settingsOpen} anchorEl={anchorEl} onClose={handleSettingsClose} sx={{pt:0}}>
      <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center", m:0 }}>
        {user?.username}
      </MenuItem>
      <StyledDivider />
      <MenuItem onClick={navigateToSettings}>Settings</MenuItem>
      <MenuItem onClick={navigateToAbout}>About</MenuItem>
      <MenuItem onClick={() => logout(currentRoom)}>Logout</MenuItem>
    </Menu>
  );
};
