import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import useSocketFunctions from "../../hooks/useSocketFunctions";
import { Course, Question, Room } from "../../globals/types";
import { useAuth } from "../../context/context";
import SendIcon from "@mui/icons-material/Send";
import useStore from "../../store/store";

type Props = {
    question: Question;
    index: number;
    course: Course;
};

const ResponseBox = ({ question, index, course }: Props) => {
    const { user } = useAuth();
    const [ response, setResponse] = useState<string>("");
    const { sendResponse } = useSocketFunctions();

    const [socket] = useStore(
        (state) =>[
            state.socket,
        ]
    );

    const updateQuestionFields = (title: any, content: any) => {
        console.log("updating message fields");
        const formattedQuestion = {
            username: user?.username,
            title,
            content,
            answered: false,
            responses: [],
        };
    };

    const handleSendResponse = async () => {
        const answerUsername = user?.username;
        question.responses.push({answerUsername, response});

        await sendResponse(question, {answerUsername, response}, index, course._id.$oid);
        setResponse("");
    }

    const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResponse(e.target.value);
    };

    const handleEnterKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendResponse();
        }
      };

    return(
        <Box
          display={"flex"}
          sx={{
            pl: 2,
            pr: 2,
          }}
        >
          <TextField
            label="Type your answer"
            value={response}
            disabled={!socket?.connected}
            sx={{
              width: "100%",
            }}
            onChange={handleResponseChange}
            onKeyDown={handleEnterKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendResponse}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      );
}

export default React.memo(ResponseBox);