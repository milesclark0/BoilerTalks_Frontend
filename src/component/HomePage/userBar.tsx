import { Drawer, Box, List, ListItem, ListItemText, Typography, Button } from "@mui/material";
import React from "react";
type Props = {
  drawerWidth: number;
  innerDrawerWidth: number;
};

const UserBar = ({ drawerWidth, innerDrawerWidth }: Props) => {
    const newWidth = drawerWidth - innerDrawerWidth + 3*8;
  const OuterDrawerStyles = {
    width: newWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: newWidth,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
    },
    position: "fixed",
  };
  return (
    <Box>
      <Drawer sx={OuterDrawerStyles} anchor="right" variant="permanent">
        <Box sx={{ display: "flex"}}>
          <Button>Hi</Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UserBar;
