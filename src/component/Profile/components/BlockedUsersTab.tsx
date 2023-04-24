import { Box, Button, List, ListItem, Paper, Typography } from "@mui/material";
import React from "react";
import { User } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { unblockUserUrl } from "../../../API/BlockingAPI";
import { useAuth } from "../../../context/context";

interface Props {
  viewedUser: User;
  setViewedUser: React.Dispatch<React.SetStateAction<User>>;
}
const BlockedUsersTab = ({ viewedUser, setViewedUser }: Props) => {
  const api = useAxiosPrivate();
  const { user } = useAuth();

  const unblockUser = async (username: string) => {
    const res = await api.post(unblockUserUrl, { toUnblock: username, username: user?.username });
    if (res.status === 200) {
      setViewedUser((prev) => {
        return {
          ...prev,
          blockedUsers: prev.blockedUsers.filter((user) => user !== username),
        };
      });
    }
  };

  const BlockerUser = ({ username }: { username: string }) => {
    return (
      <Paper
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          mb: 1,
          bgcolor: "primary.main",
          borderRadius: "3%",
        }}
      >
        <Typography>{username}</Typography>
        <Button variant="outlined" color="secondary" onClick={() => unblockUser(username)}>
          Unblock
        </Button>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        overflowY: "auto",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        maxHeight: "53vh",
        bgcolor: "primary.main",
        borderRadius: "3%",
        minHeight: "53vh"
      }}
    >
      <Typography variant="h6" sx={{ pb: 1 }}>
        Blocked Users
      </Typography>
      <List>
        {viewedUser?.blockedUsers?.length > 0 ? (
          viewedUser?.blockedUsers.map((username) => <BlockerUser username={username} key={username} />)
        ) : (
          <Typography color={"primary.main"}>--None--</Typography>
        )}
      </List>
    </Box>
  );
};

export default BlockedUsersTab;
