import { Menu, MenuItem } from "@mui/material";
import {useState} from "react";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { StyledDivider } from "../SideBar/StyledDivider";

type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

const UserMenu = ({ anchorEl, setAnchorEl }: Props) => {
  const navigate = useNavigate();
  const openUserMenu = Boolean(anchorEl);

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    // navigate("/profile/" + user.username);
  };

  return (
    <Menu open={openUserMenu} anchorEl={anchorEl} onClose={handleUserMenuClose} sx={{ pt: 0 }}>
      <MenuItem onClick={navigateToProfile} sx={{ justifyContent: "center", m: 0 }}>
        Profile
      </MenuItem>
      <StyledDivider />
      {/* <MenuItem onClick={navigateToSettings}>Settings</MenuItem>
      <MenuItem onClick={navigateToAbout}>About</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem> */}
    </Menu>
  );
};

export default UserMenu;
