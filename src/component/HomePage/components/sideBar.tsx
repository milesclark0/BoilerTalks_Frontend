import {
  Drawer,
  Typography,
  Avatar,
  ListItem,
  List,
  IconButton,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Course, Room, User } from "../../../globals/types";
import { APP_STYLES } from "../../../globals/globalStyles";
import React from "react";
import { useEffect, useState } from "react";
import { Settings } from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAuth } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CourseIcon } from "./CourseIcon";
import { StyledDivider } from "../../SideBar/components/StyledDivider";
import { SettingsMenu } from "../../SideBar/components/SettingsMenu";
import { CourseNavigation } from "../../SideBar/CourseNavigation";
import { CourseView } from "../../SideBar/CourseView";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import ThemeSwitch from "./themeSwitch";
import useStore from "../../../store/store";

const SideBar = ({ ...props }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeIcon, setActiveIcon, setDistinctDepartments, setCurrentCourse] = useStore(
    (state) => [
      state.activeIcon,
      state.setActiveIcon,
      state.setDistinctDepartments,
      state.setCurrentCourse
    ]
  );

  const OuterDrawerStyles = {
    width: APP_STYLES.DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: APP_STYLES.DRAWER_WIDTH,
      boxSizing: "border-box",
      borderColor: "rgba(7, 7, 7, 0.199)",
    },
    position: "fixed",
  };

  const InnerDrawerStyles = {
    width: APP_STYLES.INNER_DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: APP_STYLES.INNER_DRAWER_WIDTH,
      boxSizing: "border-box",
      overflow: "hidden",
      borderColor: "rgba(7, 7, 7, 0.199)",
      overflowY: "scroll",
      paddingTop: `${APP_STYLES.APP_BAR_HEIGHT}px`,
      "&::-webkit-scrollbar": {
        display: "none",
      },
      alignItems: "center",
    },
  };
  // get distinct departments from course list

  useEffect(() => {
    const distinctDepartments = [
      ...new Set(user?.courses.map((course) => course.split(" ")[0])),
    ];
    setDistinctDepartments(distinctDepartments);
  }, []);

  const handleIconClick = (course: string, isActiveCourse: boolean) => {
    if (course === activeIcon.course) {
      return;
    }
    if (course === "") {
      // home button is clicked
      setCurrentCourse(null);
    }
    setActiveIcon(course, isActiveCourse);
  };

  return (
    <Box>
      <SideAppBar />
      <Drawer sx={OuterDrawerStyles} variant="permanent" anchor="left">
        <Box
          sx={{
            display: "flex",
            paddingLeft: `${APP_STYLES.INNER_DRAWER_WIDTH}px`,
            paddingTop: `${APP_STYLES.APP_BAR_HEIGHT}px`,
          }}
        >
          {/* Outer Side Bar */}
          <CourseView />
        </Box>
        {/* Inner Side Bar */}
        <Drawer sx={InnerDrawerStyles} variant="permanent" anchor="left">
          <CourseIconsList handleIconClick={handleIconClick} />
        </Drawer>
      </Drawer>
    </Box>
  );
};

const GetProfilePicture = () => {
  const { user } = useAuth();
  return (
    <Avatar
      sx={{ width: 50, height: 50, mr: 2 }}
      src={user?.profilePicture + `?${Date.now()}`}
    />
  );
};

type CourseIconProps = {
  handleIconClick: (course: string, isActiveCourse: boolean) => void;
  AvatarSize: { width: number; height: number };
  selectedIconColor: string;
};

const BoilerTalksIcon = ({
  AvatarSize,
  handleIconClick,
  selectedIconColor,
}: CourseIconProps) => {
  const activeIcon = useStore((state) => state.activeIcon);
  const outLineColor = activeIcon.course === "" ? selectedIconColor : "";
  const outlineStyle = activeIcon.course === "" ? "solid" : "";
  return (
    <ListItem>
      <IconButton onClick={() => handleIconClick("", false)}>
        <Avatar
          sx={{
            ...AvatarSize,
            outlineColor: outLineColor,
            outlineStyle: outlineStyle,
          }}
        >
          <Typography sx={{ marginTop: "5px" }}>
            <HomeIcon />
          </Typography>
        </Avatar>
      </IconButton>
    </ListItem>
  );
};

type CourseListProps = {
  handleIconClick: (course: string, isActiveCourse: boolean) => void;
};
const CourseIconsList = ({ handleIconClick }: CourseListProps) => {
  const { user } = useAuth();
  const distinctDepartments = useStore((state) => state.distinctDepartments);
  const selectedIconColor = "#7e7e7e";
  const AvatarSize = { width: 50, height: 50 };
  const CourseIconProps = {
    handleIconClick: handleIconClick,
    AvatarSize: AvatarSize,
    selectedIconColor: selectedIconColor,
  };
  return (
    <List>
      <BoilerTalksIcon {...CourseIconProps} />
      <StyledDivider />
      {user.activeCourses?.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon
            labelText={course}
            isActiveCourse={true}
            {...CourseIconProps}
          />
        </React.Fragment>
      ))}
      {user.activeCourses.length > 0 && <StyledDivider />}
      {distinctDepartments.map((course: string) => (
        <React.Fragment key={course}>
          <CourseIcon
            labelText={course}
            isActiveCourse={false}
            {...CourseIconProps}
          />
        </React.Fragment>
      ))}
    </List>
  );
};

const SideAppBar = () => {
  const { user, profile } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [themeChecked, setThemeChecked] = useState(
    false || localStorage.getItem("themeSetting") === "dark"
  );

  const { handleThemeSettingChange } = useAuth();

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeChecked = () => {
    handleThemeSettingChange();
    setThemeChecked(!themeChecked);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: APP_STYLES.DRAWER_WIDTH,
        left: 0,
        height: APP_STYLES.APP_BAR_HEIGHT,
      }}
    >
      <Toolbar>
        <GetProfilePicture />
        <Typography variant="body2" noWrap component="div" sx={{ flexGrow: 1 }}>
          {profile?.displayName || user?.username}
        </Typography>
        <FormControlLabel
          control={
            <ThemeSwitch
              sx={{ m: 1 }}
              checked={themeChecked}
              onChange={() => handleThemeChecked()}
            />
          }
          label=""
        />
        <IconButton onClick={handleSettingsClick}>
          <Settings />
        </IconButton>
        <SettingsMenu {...{ anchorEl, setAnchorEl }} />
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(SideBar);
