import { Menu, MenuItem } from "@mui/material";
import React from "react";
import useLogout from "../../hooks/useLogout";
import { StyledDivider } from "./StyledDivider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

export const SettingsMenu = ({ anchorEl, setAnchorEl }: Props) => {
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
    <Menu open={settingsOpen} anchorEl={anchorEl} onClose={handleSettingsClose}>
      <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center" }}>
        {user?.username}
      </MenuItem>
      <StyledDivider />
      <MenuItem onClick={navigateToSettings}>Settings</MenuItem>
      <MenuItem onClick={navigateToAbout}>About</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );
};
