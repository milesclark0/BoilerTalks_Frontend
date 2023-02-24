import { Button, Box, TextField, InputAdornment, Typography, Divider, Modal, IconButton, Stack, Autocomplete, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { getAllCoursesURL, subscribeToCourseURL } from "../../API/CoursesAPI";
import { User } from "../../types/types";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/context";
import React from "react";
import { editProfileURL } from "../../API/ProfileAPI";

type Props = {
    user: User;
    showEditBio: boolean;
    setShowEditBio: (value: boolean) => void;
};
const EditBioModal = ({ user, showEditBio, setShowEditBio }: Props) => {
    const api = useAxiosPrivate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState<string>("");
  
    // handles modal close
    const handleClose = (event: Event, reason: string) => {
        if (reason === "backdropClick") {
        return;
        }
        setShowEditBio(false);
    };

    const editBio = async () => {
        return await api.post(editProfileURL, {bio: textInput, username: user.username})
    };

    const handleSubmit = (event) => {
        const res = editBio();

        event.preventDefault();
    };

    const handleChange = (event) => {
        setTextInput(event.target.value);
    }

    return (
        <Modal open={showEditBio} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 600,
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              borderRadius: "10px",
              boxShadow: 24,
              p: 2,
              paddingRight: 4,
              display: "flex",
              maxHeight: 450,
            }}
          >
            <form onSubmit={handleSubmit}>        
                <label>
                    Edit your bio:
                    <textarea value={textInput} onChange={handleChange}/>        
                </label>
                <input type="submit" value="Submit" />
            </form>
          </Box>
        </Modal>
      );
};
export default EditBioModal;