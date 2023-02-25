import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "@mui/material";
//import { addRoomToCourseURL } from "../../API/CoursesAPI";
import { useAuth } from "../../../../context/context";
import { Course, Room } from "../../../../types/types";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

type RulesProps = {
  RulesText: string;
  RulesOpen: boolean;
  setRulesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRulesText: React.Dispatch<React.SetStateAction<string>>;
  course: Course;
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
};

const RulesModal = ({ RulesText, RulesOpen, setRulesText, setRulesOpen, course, setUserCourses, userCourses }: RulesProps) => {
  const api = useAxiosPrivate();

  const handleCloseRules = () => {
    setRulesOpen(false);
    setRulesText(""); //wipe the text field
  };

  const SaveRules = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRules = event.target[0].value;
    console.log(newRules);

    setRulesOpen(false);
    setRulesText(newRules);
  };

  return (
    <Dialog open={RulesOpen} onClose={handleCloseRules}>
      <Box component={"form"} onSubmit={SaveRules}>
        <DialogTitle>Rules</DialogTitle>
        <DialogContent>
          <DialogContentText>Rules for this course discussion:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rulesdialog"
            label="Rules"
            type="text"
            variant="outlined"
            fullWidth
            rows={10}
            multiline
            value={RulesText}
            onChange={(e) => setRulesText(e.target.value)}
            sx={{
              width: 500,
              display: "flex",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRules}>Cancel</Button>
          <Button variant="outlined" type="submit">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
export default RulesModal;