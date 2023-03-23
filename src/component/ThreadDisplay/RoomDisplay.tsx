// Display for messages
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Course, Room, Message, CourseManagement } from "../../types/types";
import { useOutletContext, useParams } from "react-router-dom";
import useSockets from "../../hooks/useSockets";
import UserBar from "../HomePage/userBar";
import MessageBox from "../HomePage/messageBox";
import { getCourseManagementURL } from "../../API/CourseManagementAPI";
import BanDialog from "../ThreadComponents/BanDialog";
import WarningDialog from "../ThreadComponents/WarningDialog";
import UserMenu from "../ThreadComponents/UserMenu";

type Props = {
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  activeIcon: { course: string; isActiveCourse: boolean };
  currentCourse: Course | null;
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  userCourses: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (message: { username: string; message: string; timeSent: string }, room: Room, isSystemMessage: boolean) => void;
  connectToRoom: (room: Room) => void;
  disconnectFromRoom: (room: Room) => void;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  defaultPadding: number;
  distinctCoursesByDepartment: Course[];
  setDistinctCoursesByDepartment: React.Dispatch<React.SetStateAction<Course[]>>;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveCourseThread: React.Dispatch<React.SetStateAction<string>>;
  courseUsers: [{username: string, profilePic: string}]
};

type WarnOrBan = {
  username: string;
  reason: string;
};

type Appeal = {
  username: string;
  response: string;
  reason: string;
  reviewed: boolean;
  unban: boolean;
};

const RoomDisplay = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { message, setMessage, messages, setMessages, sendMessage, connectToRoom, disconnectFromRoom } = useSockets();
  const { courseId, roomId } = useParams();
  const { roomProps } = useOutletContext<{
    roomProps: Props;
  }>();
  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  // const [courseData, setCourseData] = useState<CourseManagement>(null);
  // const navigate = useNavigate();

  // get course management
  useEffect(() => {
    const fetchCourseManagement = async () => {
      const res = await axiosPrivate.get(getCourseManagementURL + courseId);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          const resData = res.data.data;
          // setCourseData(resData);
          resData?.bannedUsers.forEach((item) => {
            if (item.username === user?.username) {
              // find if user has sent an appeal
              resData?.appeals.forEach((appeal) => {
                if (appeal.username === user?.username) {
                  setAppealData(appeal);
                }
              });
              setBanned(true);
              setBannedData(item);
            }
          });
          resData?.warnedUsers.forEach((item) => {
            if (item.username === user?.username) {
              setWarned(true);
              setWarnedData(item);
            }
          });
        }
      }
    };
    // if (roomProps.currentCourse) {
    fetchCourseManagement();
    // }
  }, [roomProps.currentCourse]);

  const getCurrentRoomMessages = () => {
      //find room in currentCourse since currentRoom messages are not updated
      let foundRoom: Room;
      roomProps.currentCourse?.rooms.forEach((room) => {
        if (room.name === roomProps.currentRoom?.name) {
          foundRoom = room;
        }
      });
      return foundRoom ? foundRoom.messages : [];
  };

  // when the current course changes, we want to update the messages
  // useEffect(() => {
  //   if (roomProps.currentCourse) {
  //     console.log("currentCourse")
  //     assignMessages(roomProps.currentCourse.rooms[0]);
  //   }
  // }, [roomProps.currentCourse]);

  // when the current room changes, we want to update the messages
  useEffect(() => {
    if (roomProps.currentRoom) {
      assignMessages(roomProps.currentRoom);
      roomProps.setActiveCourseThread(roomProps.currentRoom?.name.replace(roomProps.currentCourse?.name, ""));
    }
  }, [roomProps.currentRoom]);

  const assignMessages = (room: Room) => {
    //find room in userCourses since currentRoom messages are not updated
    let foundRoom: Room;
    roomProps.userCourses?.forEach((course) => {
      course.rooms.forEach((room) => {
        if (room.name === roomProps.currentRoom?.name) {
          foundRoom = room;
        }
      });
    });

    const newMessages = foundRoom?.messages.map((message) => {
      const newMessage = {
        username: message.username,
        message: message.message,
        timeSent: message.timeSent,
      };
      return newMessage;
    });
    setMessages(newMessages);
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }} id="room">
      {(banned || warned) && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {banned ? <BanDialog bannedData={bannedData} appealData={appealData} /> : <WarningDialog setWarned={setWarned} warnedData={warnedData} />}
        </Box>
      )}
      {!banned && !warned && (
        <Box sx={{ height: "100%", width: "100%" }}>
          <Box
            sx={{
              p: roomProps.defaultPadding,
              width: `calc(100% - ${roomProps.drawerWidth}px)`,
              maxHeight: `calc(100% - ${roomProps.appBarHeight * 2 + 30}px)`,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
            className="scrollBar"
            id="messages"
          >
            {getCurrentRoomMessages().length > 0 ? (
              <Box>
                <Typography variant="h4">Messages</Typography>
                <Box>
                  {getCurrentRoomMessages().map((message, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        <Box>
                          <UserMenu username={message.username} course={roomProps.currentCourse} />
                        </Box>
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="h6" display="inline">{`[${message.username}]: `}</Typography>
                          <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                            {message.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">No messages yet!</Typography>
            )}
          </Box>
          <UserBar {...roomProps} />
          <Box
            sx={{
              height: `${roomProps.appBarHeight}px`,
              position: "absolute",
              bottom: 20,
              right: `${roomProps.drawerWidth - roomProps.innerDrawerWidth + 3 * 8}px`,
              left: `${roomProps.drawerWidth}px`,
            }}
          >
            <MessageBox {...roomProps} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RoomDisplay;
