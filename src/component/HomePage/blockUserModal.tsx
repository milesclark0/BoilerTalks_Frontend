import { Button, Box, Typography, Modal } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { blockUserUrl } from "../../API/BlockingAPI";

type Props = {
    requestUsername: string;
    userToBlock: string;
    showBlockUser: boolean;
    setShowBlockUser: (value: boolean) => void;
};
const BlockUserModal = ({ requestUsername, userToBlock, showBlockUser, setShowBlockUser }: Props) => {
    const api = useAxiosPrivate();
  
    // handles modal close
    const handleClose = () => {
        /*if (reason === "backdropClick") {
        return;
        }*/
        setShowBlockUser(false);
    };

    const handleSubmit = async (event) => {
        const res = await api.post(blockUserUrl, {toBlock: userToBlock, username: requestUsername});

        if (res.data.statusCode === 200) {
          event.preventDefault();
          handleClose();
          window.location.reload();
        }

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
              Are you sure you want to block {userToBlock}? You can unblock them at any time.
            </Typography>
            <br></br>
            <Button type="submit" variant="outlined" onClick={handleSubmit}>Block</Button>
            <Button type="button" variant="outlined" onClick={handleClose}>Cancel</Button>
          </Box>
        </Modal>
      );
};
export default BlockUserModal;