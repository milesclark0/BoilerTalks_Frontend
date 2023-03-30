import { Button, Box, TextField, InputAdornment, Typography, Divider, Modal, IconButton, Stack, Autocomplete, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { User } from "../../types/types";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/context";
import React from "react";
import { blockUserUrl } from "../../API/BlockingAPI";

type Props = {
    requestUsername: string;
    userToBlock: string;
    showBlockUser: boolean;
    setShowBlockUser: (value: boolean) => void;
};
const BlockUserModal = ({ requestUsername, userToBlock, showBlockUser, setShowBlockUser }: Props) => {
    const api = useAxiosPrivate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
  
    // handles modal close
    const handleClose = (event: Event, reason: string) => {
        /*if (reason === "backdropClick") {
        return;
        }*/
        setShowBlockUser(false);
    };

    const blockUser = async () => {
        return await api.post(blockUserUrl, {toBlock: userToBlock, username: requestUsername});
    };

    const handleSubmit = (event) => {
        const res = blockUser();

        event.preventDefault();
        handleClose(event.hide, "close");
        //DOM update needed
    };

    return (
        <Modal open={showBlockUser} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 740,
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 24,
              p: 2,
              paddingRight: 4,
              display: "inline",
              maxHeight: 400,
              justifyContent: "left",
              
            }}
          >
            <Typography variant = "h4">
              Are you sure you want to block user {userToBlock}? You can unblock them at any time.
            </Typography>
            <br></br>
            <Button type="submit" variant="outlined" onClick={handleSubmit}>Block</Button>
            <Button type="button" variant="outlined" onClick={handleClose}>Cancel</Button>
          </Box>
        </Modal>
      );
};
export default BlockUserModal;