import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import useSocketFunctions from "../../hooks/useSocketFunctions";
import { Course, Question, Room } from "../../globals/types";
import { useAuth } from "../../context/context";
import SendIcon from "@mui/icons-material/Send";
import useStore from "../../store/store";

type Props = {
    questions: Question[];
    course: Course
};

const AskQuestionBox = ({ questions, course }: Props) => {
    const { user } = useAuth();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const { sendQuestion } = useSocketFunctions();

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

    const handleSendQuestion = async () => {
        const formattedQuestion = {
            username: user?.username,
            title,
            content,
            answered: false,
            responses: [],
        };
        console.log("Trying to send a new question " + formattedQuestion.title);
        await sendQuestion(formattedQuestion, course._id.$oid);
        setTitle("");
        setContent("");
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
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
            label="Enter a post title"
            value={title}
            disabled={!socket?.connected}
            sx={{
              width: "100%",
            }}
            onChange={handleTitleChange}
          />
          <TextField
            label="What's your question?"
            value={content}
            disabled={!socket?.connected}
            sx={{
              width: "100%",
            }}
            onChange={handleContentChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSendQuestion}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      );
}

export default React.memo(AskQuestionBox);