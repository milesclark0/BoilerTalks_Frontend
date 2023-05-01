import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "globals/mui";
//import { addRoomToCourseURL } from "API/CoursesAPI";
import { useAuth } from "context/context";
import { Course, Room } from "globals/types";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { getCourseManagementURL, updateCourseRulesURL } from "API/CourseManagementAPI";
import { useQuery } from "react-query";

type RulesProps = {
  RulesList: string[];
  RulesOpen: boolean;
  setRulesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRulesList: React.Dispatch<React.SetStateAction<string[]>>;
  course: Course;
};

const RulesModal = ({ RulesList, RulesOpen, setRulesList, setRulesOpen, course }: RulesProps) => {
  const api = useAxiosPrivate();

  const handleCloseRules = () => {
    setRulesOpen(false);
  };

  const handleRulesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRulesList = [...RulesList];
    newRulesList[index] = e.target.value;
    setRulesList(newRulesList);
  };

  const handleAddRule = () => {
    setRulesList([...RulesList, ""]);
  };

  const { isLoading, error, data } = useQuery(["course_mngmt", course?._id.$oid], () => api.get(getCourseManagementURL + course?._id.$oid), {
    onSuccess: (data) => {
      setRulesList(data.data.data.rules);
    },
  });

  const SaveRules = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //fetch course management api
    const res = await api.post(updateCourseRulesURL + course?._id.$oid, {
      rules: RulesList,
    });
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
    } else {
      console.log(res.data.message);
    }
    setRulesOpen(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={RulesOpen} onClose={handleCloseRules}>
      <Box component={"form"} onSubmit={SaveRules}>
        <DialogTitle>Rules</DialogTitle>
        <DialogContent>
          <DialogContentText>Rules for this course discussion:</DialogContentText>
          {RulesList?.map((rule, index) => {
            return (
              <Box key={index}>
                <RuleEntry rule={rule} index={index} handleRulesChange={handleRulesChange} key={index} />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleAddRule}>
            Add Rule
          </Button>
          <Button onClick={handleCloseRules}>Cancel</Button>
          <Button variant="outlined" type="submit">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const RuleEntry = ({
  rule,
  index,
  handleRulesChange,
}: {
  rule: string;
  index: number;
  handleRulesChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}) => {
  return (
    <TextField
      autoFocus
      margin="dense"
      id="rulesdialog"
      label="Rules"
      type="text"
      variant="outlined"
      fullWidth
      multiline
      value={rule}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRulesChange(e, index)}
      sx={{
        width: 500,
        display: "flex",
      }}
    />
  );
};
export default RulesModal;
