import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { StyledDivider } from "../SideBar/StyledDivider";

type Props = {
  //   anchorEl: HTMLElement | null;
  //   setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  username: string;
};

const UserMenu = ({ username }: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    // console.log(username);
    navigate("/profile/" + username);
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
        <StyledDivider />
        <MenuItem>Warn</MenuItem>
        <MenuItem>Ban</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default UserMenu;
