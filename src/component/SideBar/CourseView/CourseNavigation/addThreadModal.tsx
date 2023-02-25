import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "@mui/material";
import { addRoomToCourseURL } from "../../../../API/CoursesAPI";
import { useAuth } from "../../../../context/context";
import { Course, Room } from "../../../../types/types";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

type AddThreadProps = {
  newThreadValue: string;
  newThreadOpen: boolean;
  setNewThreadOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewThreadValue: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
};

const AddThreadModal = ({
  newThreadValue,
  newThreadOpen,
  setNewThreadOpen,
  setNewThreadValue,
  course,
  setUserCourses,
  userCourses,
}: AddThreadProps) => {
  const api = useAxiosPrivate();
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
      userCourses.forEach((userCourse) => {
        if (userCourse.name === course?.name) {
          course.rooms.push(newRoom);
        }
      });
      //updates the userCourses state
      setUserCourses([...userCourses]);
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
