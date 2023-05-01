import { Button, Box, TextField, Typography, Modal } from "globals/mui";
import { useState } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useAuth } from "context/context";
import { editProfileURL } from "API/ProfileAPI";

type Props = {
  requestUsername: string;
  showEditBio: boolean;
  setShowEditBio: (value: boolean) => void;
};
const EditBioModal = ({ requestUsername, showEditBio, setShowEditBio }: Props) => {
  const api = useAxiosPrivate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState<string>("");

  // handles modal close
  const handleClose = (event: Event, reason: string) => {
    /*if (reason === "backdropClick") {
        return;
        }*/
    setShowEditBio(false);
  };

  const editBio = async () => {
    return await api.post(editProfileURL, { bio: textInput, username: requestUsername });
  };

  const handleSubmit = (event) => {
    const res = editBio();

    event.preventDefault();
    handleClose(event.hide, "close");
    //DOM update needed
  };

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <Modal open={showEditBio} onClose={handleClose}>
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
        <form onSubmit={handleSubmit}>
          <Typography variant="h3">
            Edit your bio:
            <br></br>
            <TextField value={textInput} onChange={handleChange} multiline margin="dense" fullWidth rows={3} maxRows={8} />
          </Typography>
          <br></br>
          <Button type="submit" variant="outlined">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
export default EditBioModal;
