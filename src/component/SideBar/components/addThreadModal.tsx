import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "@mui/material";
import { addRoomToCourseURL } from "../../../API/CoursesAPI";
import { useAuth } from "../../../context/context";
import { Course, Room } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useStore from "../../../store/store";

type AddThreadProps = {
  newThreadValue: string;
  newThreadOpen: boolean;
  setNewThreadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewThreadValue: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
};

const AddThreadModal = ({ newThreadValue, newThreadOpen, setNewThreadOpen, setNewThreadValue, course }: AddThreadProps) => {
  const api = useAxiosPrivate();
  const addUserRoom = useStore((state) => state.addUserRoom);
  const handleCloseNewThread = () => {
    setNewThreadOpen(false);
    setNewThreadValue(""); //wipe the text field
  };

  const handleCreateNewThread = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRoomName = event.target[0].value; //newRoomName
    console.log(newRoomName);

    const res = await api.post(addRoomToCourseURL, { courseName: course.name, roomName: newRoomName });
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
      const newRoom: Room = res.data.data;
      //updates the userCourses state
      addUserRoom(newRoom);
    }
    setNewThreadOpen(false); //newThreadValue
    setNewThreadValue(""); //wipe the text field
  };

  return (
    <Dialog open={newThreadOpen} onClose={handleCloseNewThread}>
      <Box component={"form"} onSubmit={handleCreateNewThread}>
        <DialogTitle>Create a new thread</DialogTitle>
        <DialogContent>
          <DialogContentText>To create a new thread for this course, please enter the thread name here.</DialogContentText>
          <TextField autoFocus margin="dense" id="newThreadName" label="New Thread Name" type="text" variant="outlined" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewThread}>Cancel</Button>
          <Button variant="outlined" type="submit">
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
export default AddThreadModal;
