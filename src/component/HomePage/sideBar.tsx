import { Drawer, Typography, Avatar, ListItem, List, IconButton, Box, AppBar, Toolbar } from "@mui/material";
import { Course, Room, User } from "../../types/types";
import React from "react";
import { useEffect, useState } from "react";
import { Settings } from "@mui/icons-material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../context/context";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CourseIcon } from "../SideBar/CourseIcon";
import { StyledDivider } from "../SideBar/StyledDivider";
import { SettingsMenu } from "../SideBar/SettingsMenu";
import { CourseNavigation } from "../SideBar/CourseView/CourseNavigation";
import { CourseView } from "../SideBar/CourseView";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
  user: User;
  activeIcon: { course: string; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: String; isActiveCourse: boolean }>>;
  drawerWidth: number;
  innerDrawerWidth: number;
  appBarHeight: number;
  currentCourse: Course | null;
  distinctCoursesByDepartment: Course[];
  setUserCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  userCourses: Course[];
  setCurrentCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  currentRoom: Room | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setActiveCourseThread: React.Dispatch<React.SetStateAction<string>>;
  activeCourseThread: string;
  distinctDepartments: string[];
  setDistinctDepartments: React.Dispatch<React.SetStateAction<string[]>>;
};

const SideBar = ({ ...props }: Props) => {
  const [newThreadOpen, setNewThreadOpen] = useState(false); //whether a create new thread dialogue is open or not
  const [newThreadValue, setNewThreadValue] = useState(""); //What the new thread name string is
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [themeChecked, setThemeChecked] = useState(true);
  const {handleThemeSettingChange} = useAuth();

  const handleThemeChecked = () => {
    handleThemeSettingChange();
    setThemeChecked(!themeChecked);
  };

  const {
    user,
    activeIcon,
    setActiveIcon,
    drawerWidth,
    innerDrawerWidth,
    appBarHeight,
    currentCourse,
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    setCurrentCourse,
    currentRoom,
    setCurrentRoom,
    setActiveCourseThread,
    activeCourseThread,
    distinctDepartments,
    setDistinctDepartments,
  } = props;

  const OuterDrawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
    },
    position: "fixed",
  };

  const InnerDrawerStyles = {
    width: innerDrawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: innerDrawerWidth,
      boxSizing: "border-box",
      overflow: "hidden",
      borderColor: "rgba(7, 7, 7, 0.199)",
      overflowY: "scroll",
      paddingTop: `${appBarHeight}px`,
      "&::-webkit-scrollbar": {
        display: "none",
      },
      alignItems: "center",
    },
  };
  // get distinct departments from course list

  useEffect(() => {
    const distinctDepartments = [...new Set(user?.courses.map((course) => course.split(" ")[0]))];
    setDistinctDepartments(distinctDepartments);
  }, []);
  /*const toggleThemeSetting = () => {
        if (themeSetting === 'light') {
          setThemeSetting('dark');
        } else {
          setThemeSetting('light');
        }
      };*/
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& + .MuiDrawer-paper': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    },
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const handleIconClick = (course: string, isActiveCourse: boolean) => {
    setActiveIcon({ course: course, isActiveCourse: isActiveCourse });
    if (course === "") {
      navigate("/home");
    } else {
      if (!isActiveCourse) {
        navigate(`/home/courses`);
      }
    }
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const SettingsMenuProps = {
    anchorEl,
    setAnchorEl,
    currentRoom,
  };

  const CourseListProps = {
    activeIcon,
    distinctDepartments,
    handleIconClick,
    setActiveIcon,
  };

  const CourseViewProps = {
    activeIcon,
    currentCourse,
    distinctCoursesByDepartment,
    setUserCourses,
    userCourses,
    distinctDepartments,
    setDistinctDepartments,
    setActiveIcon,
    newThreadOpen,
    setNewThreadOpen,
    newThreadValue,
    setNewThreadValue,
    setCurrentCourse,
    currentRoom,
    setCurrentRoom,
    setActiveCourseThread,
    activeCourseThread,
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ width: drawerWidth, left: 0, height: appBarHeight }}>
        <Toolbar>
          <GetProfilePicture />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Hi, {user?.username}
          </Typography>
          <FormControlLabel
            control={<MaterialUISwitch sx={{ m: 1 }} checked={themeChecked} onChange={() => handleThemeChecked()}/>}
            label=""           
          />
          <IconButton onClick={handleSettingsClick}>
            <Settings />
          </IconButton>
          <SettingsMenu {...SettingsMenuProps} />
        </Toolbar>
      </AppBar>
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
        <Box
          sx={{
            display: "flex",
            paddingLeft: `${innerDrawerWidth}px`,
            paddingTop: `${appBarHeight}px`,
          }}
        >
          <CourseView {...CourseViewProps} />
        </Box>
        <Drawer sx={InnerDrawerStyles} variant="permanent" anchor="left">
          <CourseIconsList {...CourseListProps} />
        </Drawer>
      </Drawer>
    </Box>
  );
};
const GetProfilePicture = () => {
  const { user } = useAuth();
  return <Avatar sx={{ width: 50, height: 50, mr: 2 }} src={user?.profilePicture + `?${Date.now()}`} />;
};

type CourseListProps = {
  activeIcon: { course: string; isActiveCourse: boolean };
  handleIconClick: (course: string, isActiveCourse: boolean) => void;
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  distinctDepartments: string[];
};

type CourseIconProps = CourseListProps & {
  selectedIconColor: string;
  distinctDepartments: string[];
  AvatarSize: { width: number; height: number };
};

const BoilerTalksIcon = ({ ...props }: CourseIconProps) => {
  const outLineColor = props.activeIcon.course === "" ? props.selectedIconColor : "";
  const outlineStyle = props.activeIcon.course === "" ? "solid" : "";
  return (
    <ListItem>
      <IconButton onClick={() => props.handleIconClick("", false)}>
        <Avatar sx={{ ...props.AvatarSize, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
          <Typography sx={{ marginTop: "5px" }}>
            <HomeIcon />
          </Typography>
        </Avatar>
      </IconButton>
    </ListItem>
  );
};

const CourseIconsList = ({ ...props }: CourseListProps) => {
  const { user } = useAuth();
  const selectedIconColor = "#7e7e7e";
  const AvatarSize = { width: 50, height: 50 };
  return (
    <List>
      <BoilerTalksIcon {...props} selectedIconColor={selectedIconColor} AvatarSize={AvatarSize} />
      <StyledDivider />
      {user.activeCourses?.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon labelText={course} isActiveCourse={true} {...props} selectedIconColor={selectedIconColor} AvatarSize={AvatarSize} />
        </React.Fragment>
      ))}
      {user.activeCourses.length > 0 && <StyledDivider />}
      {props.distinctDepartments.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon labelText={course} isActiveCourse={false} {...props} selectedIconColor={selectedIconColor} AvatarSize={AvatarSize} />
        </React.Fragment>
      ))}
    </List>
  );
};

export default SideBar;
