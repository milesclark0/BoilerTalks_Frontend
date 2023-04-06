import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { AppBar, Avatar, Box, Button, List, ListItem, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { User } from "../globals/types";
import { useLocation, useParams } from "react-router-dom";
import React from "react";
import UnblockUserModal from "../component/Blocklist/UnblockUserModal";

const Blocklist = () => {
  const { user, setUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [userToUnblock, setUserToUnblock] = useState<string>("");
  const [showUnblockUser, setShowUnblockUser] = useState<boolean>(false);

  const appBarHeight = 64;

  const unblockUserProps = {
    requestUsername: user.username,
    userToUnblock,
    showUnblockUser,
    setShowUnblockUser,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <UnblockUserModal {...unblockUserProps} />

      <AppBar position="fixed" sx={{ height: appBarHeight }}>
        <Toolbar>
          <Typography variant="h4">Users You've Blocked</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", margin: 5, pt: `${appBarHeight}px`, justifyContent: "center" }}>
        {user.blockedUsers.length !== 0 ? (
          <List>
            {user.blockedUsers
              .sort((a, b) => (a > b ? 1 : -1))
              .map((blockedUser) => {
                return (
                  <ListItem>
                    <Typography variant="h6" noWrap>
                      {blockedUser}
                    </Typography>
                    <Button
                      onClick={() => {
                        console.log("trying to block " + blockedUser);
                        setUserToUnblock(blockedUser);
                        setShowUnblockUser(true);
                      }}
                    >
                      Unblock
                    </Button>
                  </ListItem>
                );
              })}
          </List>
        ) : (
          <Typography variant="h5">You haven't blocked anyone yet!</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Blocklist;
