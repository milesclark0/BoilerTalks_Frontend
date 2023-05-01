import { ListItemIcon, Menu, MenuItem } from "globals/mui";
import React from "react";
import useLogout from "hooks/useLogout";
import { StyledDivider } from "./StyledDivider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/context";
import { Room } from "globals/types";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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

  const navigateToBlocklist = () => {
    navigate("/blocklist");
  };

  return (
    <Menu open={settingsOpen} anchorEl={anchorEl} onClose={handleSettingsClose} sx={{ pt: 0 }}>
      <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center", m: 0 }}>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        {user?.username}
      </MenuItem>
      <StyledDivider />
      <MenuItem onClick={navigateToAbout}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        About
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};
