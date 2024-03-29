import React, { useEffect, useState } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { TextField, Button, Card, Typography } from "globals/mui";
import { Box } from "@mui/system";
import { createPollURL, getPollsURL, pollVoteURL } from "API/CourseManagementAPI";
import { useAuth } from "context/context";
import useStore from "store/store";
import UserBar from "component/HomePage/components/userBar";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

export const ShowPollList = () => {
  const api = useAxiosPrivate();
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const [polls, setPolls] = useState<any[]>([]);
  const { user } = useAuth();
  const [creatingPoll, setCreatingPoll] = useState<boolean>(false);

  const fetchPolls = async () => {
    const res = await api.get(getPollsURL + currentCourse?._id.$oid);
    console.log(res);
    if (res.status == 200) {
      setPolls(res.data.data);
      console.log("Polls:");
      console.log(res.data.data);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [creatingPoll]);

  const { themeSetting } = useAuth();
  const selectedIconColor = themeSetting === "light" ? "#586fa8d5" : "#bdccf3d5";
  const borderColorResult = themeSetting === "light" ? "0.5px solid black" : "0.5px solid white";

  const handleVote = (option: number, index: number) => async () => {
    const res = await api.post(pollVoteURL + currentCourse?._id.$oid, {
      option: option,
      index: index,
      username: user?.username,
    });
    console.log(res);
    if (res.status == 200) {
      console.log(res.data.data);
    }
    fetchPolls();
  };

  function calculateWidth(poll: any, option: number) {
    const total = poll.one_votes + poll.two_votes + poll.three_votes + poll.four_votes;
    if (option == 1) {
      const result = (poll.one_votes / total) * 100;
      const ret = `${result}%`;
      return ret;
    } else if (option == 2) {
      const result = (poll.two_votes / total) * 100;
      const ret = `${result}%`;
      return ret;
    } else if (option == 3) {
      const result = (poll.three_votes / total) * 100;
      const ret = `${result}%`;
      return ret;
    } else {
      const result = (poll.four_votes / total) * 100;
      const ret = `${result}%`;
      return ret;
    }
  }

  function toggleCreatingPoll() {
    setCreatingPoll(!creatingPoll);
  }

  if (!creatingPoll) {
    return (
      <Box>
        <Box
          sx={{
            width: "80%",
            marginTop: "10px",
            marginLeft: "25px",
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            height: "90vh",
          }}
        >
          {polls.length == 0 ? <Typography variant="h4">No Polls Yet!</Typography> : null}
          {polls.map((poll, index) => (
            <Card
              id="poll-container"
              sx={{
                p: 10,
                bgcolor: "primary.main",
                borderRadius: "2%",
                padding: "15px",
                marginBottom: "20px",
              }}
            >
              <Box key={index} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h5"
                  sx={{
                    display: "flex",
                    alignSelf: "flex-start",
                    paddingBottom: "13px",
                  }}
                >
                  {poll.question}
                </Typography>

                {poll.voted_users && poll.voted_users.includes(user?.username) ? (
                  <Typography variant="h6" sx={{ textDecoration: "underline", marginBottom: "10px" }}>
                    Results:
                  </Typography>
                ) : null}

                {poll.voted_users && !poll.voted_users.includes(user?.username) ? (
                  <Box>
                    <Button
                      variant="contained"
                      sx={{
                        color: "black",
                        backgroundColor: selectedIconColor,
                        marginBottom: "15px",
                        width: "100%",
                      }}
                      onClick={handleVote(1, poll.index)}
                      disabled={poll.voted_users && poll.voted_users.includes(user?.username)}
                    >
                      {poll.option1}
                    </Button>
                    {/* <Typography>{poll.one_votes}</Typography> */}
                  </Box>
                ) : null}

                {poll.voted_users && !poll.voted_users.includes(user?.username) ? (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleVote(2, poll.index)}
                      sx={{
                        color: "black",
                        backgroundColor: selectedIconColor,
                        marginBottom: "15px",
                        width: "100%",
                      }}
                      disabled={poll.voted_users && poll.voted_users.includes(user?.username)}
                    >
                      {poll.option2}
                    </Button>
                    {/* <Typography>{poll.two_votes}</Typography> */}
                  </Box>
                ) : null}

                {poll.option3 != "" && poll.voted_users && !poll.voted_users.includes(user?.username) ? (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleVote(3, poll.index)}
                      sx={{
                        color: "black",
                        backgroundColor: selectedIconColor,
                        marginBottom: "15px",
                        width: "100%",
                      }}
                      disabled={poll.voted_users && poll.voted_users.includes(user?.username)}
                    >
                      {poll.option3}
                    </Button>
                    {/* <Typography>{poll.three_votes}</Typography> */}
                  </Box>
                ) : null}

                {poll.option4 != "" && poll.voted_users && !poll.voted_users.includes(user?.username) ? (
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleVote(4, poll.index)}
                      sx={{
                        color: "black",
                        backgroundColor: selectedIconColor,
                        marginBottom: "10px",
                        width: "100%",
                      }}
                      disabled={poll.voted_users && poll.voted_users.includes(user?.username)}
                    >
                      {poll.option4}
                    </Button>
                    {/* <Typography>{poll.four_votes}</Typography> */}
                  </Box>
                ) : null}

                {poll.voted_users && poll.voted_users.includes(user?.username) ? (
                  <React.Fragment>
                    <Box sx={{ display: "inline-flex" }}>
                      <Button
                        variant="outlined"
                        sx={{
                          border: borderColorResult,
                          backgroundColor: selectedIconColor,
                          width: calculateWidth(poll, 1),
                          marginBottom: "10px",
                          justifyContent: "space-between",
                          minWidth: "10%",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", paddingRight: "5px" }}>{poll.option1}</Typography>
                        <Typography sx={{ fontSize: "12px" }}>{calculateWidth(poll, 1)}</Typography>
                      </Button>
                    </Box>

                    <Button
                      variant="outlined"
                      sx={{
                        border: borderColorResult,
                        backgroundColor: selectedIconColor,
                        width: calculateWidth(poll, 2),
                        marginBottom: "10px",
                        justifyContent: "space-between",
                        minWidth: "10%",
                      }}
                    >
                      <Typography sx={{ fontSize: "12px", paddingRight: "5px" }}>{poll.option2}</Typography>
                      <Typography sx={{ fontSize: "12px" }}>{calculateWidth(poll, 2)}</Typography>
                    </Button>

                    {poll.option3 != "" ? (
                      <Button
                        variant="outlined"
                        sx={{
                          border: borderColorResult,
                          backgroundColor: selectedIconColor,
                          width: calculateWidth(poll, 3),
                          marginBottom: "10px",
                          justifyContent: "space-between",
                          minWidth: "10%",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", paddingRight: "5px" }}>{poll.option3}</Typography>
                        <Typography sx={{ fontSize: "12px" }}>{calculateWidth(poll, 3)}</Typography>
                      </Button>
                    ) : null}

                    {poll.option4 != "" ? (
                      <Button
                        variant="outlined"
                        sx={{
                          border: borderColorResult,
                          backgroundColor: selectedIconColor,
                          width: calculateWidth(poll, 4),
                          marginBottom: "10px",
                          justifyContent: "space-between",
                          minWidth: "10%",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px", paddingRight: "5px" }}>{poll.option4}</Typography>
                        <Typography sx={{ fontSize: "12px" }}>{calculateWidth(poll, 4)}</Typography>
                      </Button>
                    ) : null}
                  </React.Fragment>
                ) : null}

                {poll.voted_users && poll.voted_users.includes(user?.username) ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignSelf: "flex-end",
                      paddingTop: "10px",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        paddingRight: "8px",
                      }}
                    >
                      Voted
                    </Typography>
                    <ThumbUpAltIcon sx={{ color: "green" }} />
                  </Box>
                ) : null}
              </Box>
            </Card>
          ))}
          <Button variant="contained" onClick={toggleCreatingPoll}>
            Create New Poll
          </Button>
        </Box>
        <UserBar />
      </Box>
    );
  } else {
    return <PollPromptBox toggleShowPollBox={toggleCreatingPoll} />;
  }
};

interface PollPromptBoxProps {
  toggleShowPollBox: () => void;
}

export const PollPromptBox = ({ toggleShowPollBox }: PollPromptBoxProps) => {
  const [question, setQuestion] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [option3, setOption3] = useState<string>("");
  const [option4, setOption4] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { user } = useAuth();
  const [currentCourse] = useStore((state) => [state.currentCourse]);
  const [pollsCount, setPollsCount] = useState<number>(0);

  const api = useAxiosPrivate();

  const fetchPolls = async () => {
    const res = await api.get(getPollsURL + currentCourse?._id.$oid);
    console.log(res);
    if (res.status == 200) {
      setPollsCount(res.data.data.length);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await api.post(createPollURL + currentCourse?._id.$oid, {
      question: question,
      option1: option1,
      option2: option2,
      option3: option3,
      option4: option4,
      username: user?.username,
      one_votes: 0,
      two_votes: 0,
      three_votes: 0,
      four_votes: 0,
      index: pollsCount,
      voted_users: [""],
    });

    console.log({
      question,
      option1,
      option2,
      option3,
      option4,
    });
    toggleShowPollBox();
  };

  const handleQuestionChange = (event) => {
    console.log(pollsCount);
    console.log("Pollscount");
    setQuestion(event.target.value);
  };

  const handleOption1Change = (event) => {
    setOption1(event.target.value);
  };

  const handleOption2Change = (event) => {
    setOption2(event.target.value);
  };

  const handleOption3Change = (event) => {
    setOption3(event.target.value);
  };

  const handleOption4Change = (event) => {
    setOption4(event.target.value);
  };

  const handleCancel = () => {
    toggleShowPollBox();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ paddingLeft: "17px" }}>
        <h2>Enter Poll Question</h2>
        <TextField label="Question" value={question} onChange={handleQuestionChange} required sx={{ paddingBottom: "20px", width: "95%" }} />

        <h2>Enter Poll Answers</h2>
        <TextField label="Option 1" value={option1} onChange={handleOption1Change} fullWidth required sx={{ paddingBottom: "10px", width: "95%" }} />
        <TextField label="Option 2" value={option2} onChange={handleOption2Change} fullWidth required sx={{ paddingBottom: "10px", width: "95%" }} />
        <TextField label="Option 3" value={option3} onChange={handleOption3Change} fullWidth sx={{ paddingBottom: "10px", width: "95%" }} />
        <TextField label="Option 4" value={option4} onChange={handleOption4Change} fullWidth sx={{ paddingBottom: "15px", width: "95%" }} />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button sx={{ marginLeft: "10px" }} variant="contained" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};
