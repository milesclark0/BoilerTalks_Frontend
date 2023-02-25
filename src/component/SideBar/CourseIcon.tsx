import { ListItem, IconButton, Avatar, Typography } from "@mui/material";

type Props = {
  activeIcon: { course: string; isActiveCourse: boolean };
  setActiveIcon: React.Dispatch<React.SetStateAction<{ course: string; isActiveCourse: boolean }>>;
  labelText: string;
  isActiveCourse: boolean;
  selectedIconColor: string;
  AvatarSize: { width: number; height: number };
  handleIconClick: (labelText: string, isActiveCourse: boolean) => void;
};

export const CourseIcon = ({ labelText, isActiveCourse, activeIcon, setActiveIcon, selectedIconColor, AvatarSize, handleIconClick }: Props) => {
  const iconColor = isActiveCourse ? "lightblue" : "";
  const outLineColor = activeIcon.course === labelText ? selectedIconColor : "";
  const outlineStyle = activeIcon.course === labelText ? "solid" : "";
  const [department, courseNumber] = labelText.split(" ");
  const label = isActiveCourse ? department + " " + courseNumber : department;

  return (
    <ListItem>
      <IconButton onClick={() => handleIconClick(labelText, isActiveCourse)}>
        <Avatar sx={{ ...AvatarSize, bgcolor: iconColor, outlineColor: outLineColor, outlineStyle: outlineStyle }}>
          <Typography color="black" variant="body2">
            {label}
          </Typography>
        </Avatar>
      </IconButton>
    </ListItem>
  );
};
