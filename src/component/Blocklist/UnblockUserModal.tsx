import { Button, Box, Typography, Modal } from "globals/mui";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { blockUserUrl, unblockUserUrl } from "API/BlockingAPI";

type Props = {
  requestUsername: string;
  userToUnblock: string;
  showUnblockUser: boolean;
  setShowUnblockUser: (value: boolean) => void;
};
const UnblockUserModal = ({ requestUsername, userToUnblock, showUnblockUser, setShowUnblockUser }: Props) => {
  const api = useAxiosPrivate();

  // handles modal close
  const handleClose = () => {
    setShowUnblockUser(false);
  };

  const handleSubmit = async (event) => {
    const res = await api.post(unblockUserUrl, { toUnblock: userToUnblock, username: requestUsername });

    if (res.data.statusCode === 200) {
      event.preventDefault();
      handleClose();
      window.location.reload();
    }
  };

  return (
    <Modal open={showUnblockUser} onClose={handleClose}>
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
        <Typography variant="h4">Are you sure you want to unblock {userToUnblock}? You can block them again at any time.</Typography>
        <br></br>
        <Button type="submit" variant="outlined" onClick={handleSubmit}>
          Unblock
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};
export default UnblockUserModal;
