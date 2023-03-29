// Display for messages
import { useState, useEffect } from "react";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
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
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ReplyIcon from "@mui/icons-material/Reply";
import BlockIcon from "@mui/icons-material/Block";
import { blockUserUrl } from "../../API/BlockingAPI";

type Props = {
  setActiveIcon: React.Dispatch<
    React.SetStateAction<{ course: string; isActiveCourse: boolean }>
  >;
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
  sendMessage: (
    message: { username: string; message: string; timeSent: string },
    room: Room,
    isSystemMessage: boolean
  ) => void;
  connectToRoom: (room: Room) => void;
  disconnectFromRoom: (room: Room) => void;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  defaultPadding: number;
  distinctCoursesByDepartment: Course[];
  setDistinctCoursesByDepartment: React.Dispatch<
    React.SetStateAction<Course[]>
  >;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveCourseThread: React.Dispatch<React.SetStateAction<string>>;
  courseUsers: [{ username: string; profilePic: string }];
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
  const {
    message,
    setMessage,
    messages,
    setMessages,
    sendMessage,
    connectToRoom,
    disconnectFromRoom,
  } = useSockets();
  const { courseId, roomId } = useParams();
  const { roomProps } = useOutletContext<{
    roomProps: Props;
  }>();
  const [banned, setBanned] = useState<boolean>(false);
  const [bannedData, setBannedData] = useState<WarnOrBan>();
  const [warned, setWarned] = useState<boolean>(false);
  const [warnedData, setWarnedData] = useState<WarnOrBan>(null);
  const [appealData, setAppealData] = useState<Appeal>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string>("");
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
      roomProps.setActiveCourseThread(
        roomProps.currentRoom?.name.replace(roomProps.currentCourse?.name, "")
      );
    }
  }, [roomProps.currentRoom]);

  const jpeg = "data:image/jpeg;base64,";
  const { profile } = useAuth();
  const GetProfilePicture = () => {
    if (profile?.profilePicture) {
      return (
        <Avatar
          sx={{ width: 35, height: 35, mr: 2 }}
          src={jpeg + profile?.profilePicture.$binary.base64}
        />
      );
    } else {
      return (
        <Avatar
          sx={{ width: 35, height: 35, mr: 2 }}
          src={user?.profilePicture}
        />
      );
    }
  };

  function armyToRegTime(time: any) {
    var clock = time.split(" ");
    var time = clock[1];
    var time = time.split(":");
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);
    var timeValue;

    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }

    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
    timeValue += hours >= 12 ? " P.M." : " A.M."; // get AM/PM
    return timeValue;
  }

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

  const handleBlockUser = async (userToBlock) => {
    console.log("blocking user " + userToBlock);
    return await axiosPrivate.post(blockUserUrl, {toBlock: userToBlock, username: user.username});
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
          {banned ? (
            <BanDialog bannedData={bannedData} appealData={appealData} />
          ) : (
            <WarningDialog setWarned={setWarned} warnedData={warnedData} />
          )}
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
                <Typography variant="h4" paddingBottom={"5px"}>
                  Messages
                </Typography>
                <Box>
                  {getCurrentRoomMessages().map((message, index) => {
                    return (user?.blockedUsers.includes(message.username)) ? null : (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          cursor: "pointer",
                          ":hover": {
                            backgroundColor: "lightgrey",
                          },
                        }}
                        onMouseEnter={() => {
                          setHoveredMessageId(index);
                        }}
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        {/* ----MESSAGE THREAD UI */}

                        <GetProfilePicture />
                        <Box
                          sx={{
                            overflow: "hidden",
                            paddingBottom: "18px",
                            borderColor: "black",
                          }}
                        >
                          <Typography
                            variant="h6"
                            display="inline"
                          >{`${message.username} `}</Typography>
                          <Typography
                            variant="body2"
                            display="inline"
                            sx={{ color: "black", paddingLeft: "5px" }}
                          >
                            {armyToRegTime(message.timeSent)}
                          </Typography>
                          {hoveredMessageId === index && (
                            <Grid
                              container
                              sx={{
                                padding: "0",
                                margin: "0",
                                display: "inline",
                              }}
                            >
                              <Grid
                                item
                                xs={6}
                                sx={{ display: "inline", marginRight: "-5px" }}
                              >
                                <IconButton>
                                  <AddReactionIcon />
                                </IconButton>
                              </Grid>
                              <Grid item xs={6} sx={{ display: "inline" }}>
                                <IconButton>
                                  <ReplyIcon />
                                </IconButton>
                              </Grid>
                              {user?.username != message.username && (<Grid item xs={6} sx={{ display: "inline" }}>
                                <IconButton>
                                  <BlockIcon 
                                  onClick={() => handleBlockUser(message.username)}/>
                                </IconButton>
                              </Grid>)}
                            </Grid>
                          )}
                          <Typography
                            variant="body1"
                            sx={{ wordWrap: "break-word", paddingTop: "5px" }}
                          >
                            {message.message}
                          </Typography>
                        </Box>

                        {/* ----MESSAGE THREAD UI */}
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
              right: `${
                roomProps.drawerWidth - roomProps.innerDrawerWidth + 3 * 8
              }px`,
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
