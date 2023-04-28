import {
    Avatar,
    Box,
    Typography,
    IconButton,
    List,
  } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Question, Room } from "../../globals/types";
import { MessageHeader } from "./MessageHeader";
import MessageIcon from "@mui/icons-material/Message";
import { EmojiPanel } from "./emojiPanel";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import React from "react";
import { Course } from "../../globals/types";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/context";
import ResponseBox from "./responseBox";

type QuestionEntryProps = {
    question: Question;
    questions: Question[];
    index: number;
    course: Course | null;
}


const QuestionEntry = ({question, questions, index, course}: QuestionEntryProps) => {
    const { themeSetting } = useAuth();
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
          //scroll to bottom and resize list entries
          listRef.current.resetAfterIndex(0, true);
          listRef.current.scrollToItem(question.responses.length - 1, { align: "bottom" });
        }
      }, [question.responses[0]]);

    //optional: add functionality to show the question's been answered or not
    
    const getResponseListSize = () => {
        // Compute the height of the message based on its contents
        // You can use any algorithm that suits your needs
        // Here's an example based on the message text length
        const lineHeight = 40; // You can adjust this value to match your font size
        var responseLineCount = 0;
        question?.responses.forEach((response) => {
          responseLineCount += Math.ceil(response.response.length / 140);
        })
        return lineHeight * responseLineCount;
    };

    const Row = ({index, style}) => {
        const rUsername = question.responses[index].answerUsername;
        const response = question.responses[index].response;

        return (
            <div key={rUsername} style={{ ...style, scrollBehavior: "smooth" }}>
                <Typography>{response}</Typography>
            </div>
        );
    };

    return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pl: 1,
            pt: 1,
            width: "100%",
            ":hover": {
              backgroundColor: themeSetting === "dark" ? "#2f2f2f" : "#e0e0e0",
            },
          }}
        >
    
          <Box
            sx={{
              overflow: "hidden",
              borderColor: "black",
            }}
          >
            <div>
                <Typography variant="h4" style={{paddingBottom: "5px"}}>{question.title}</Typography>
                <Typography style={{paddingBottom: "5px", fontSize: "12px"}}>{question.content}</Typography>
            </div>

            <div>
                {question?.responses.length > 0 ? (
                    <List
                    height={850} // set the height of the list
                    itemCount={question?.responses.length} // set the number of items in the list
                    itemSize={getResponseListSize}
                    estimatedItemSize={100} // set the height of each item in the list
                    width="100%" // set the width of the list
                    ref={listRef}
                    style={{ overflowX: "hidden" }}
                    className="scrollBar"
                    >
                    {Row}
                    </List>
                ) : null}
            </div>
          </Box>
        </Box>
      );
    };

export default React.memo(QuestionEntry);