import {
  Divider,
  Drawer,
  Typography,
  Avatar,
  ListItem,
  List,
  IconButton,
} from "@mui/material";
import { User } from "../../types/types";

type Props = {
  user: User;
};

const SideBar = ({ user }: Props) => {
  const drawerWidth = 300;
  const innerDrawerWidth = 85;
  const AvatarSize = { width: 50, height: 50 };
  // get distinct departments from course list
  const distinctDepartments = [...new Set(user?.courses.map((course) => course.split(" ")[0]))];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderColor: "rgba(7, 7, 7, 0.199)",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Drawer
        sx={{
          width: innerDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: innerDrawerWidth,
            boxSizing: "border-box",
            overflow: "hidden",
            borderColor: "rgba(7, 7, 7, 0.199)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            alignItems: "center",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography variant="h5">{user?.username}</Typography>
        <List>
          <ListItem>
            <IconButton>
              <Avatar sx={AvatarSize}>
                <Typography>BT</Typography>
              </Avatar>
            </IconButton>
          </ListItem>
          <Divider
            sx={{
              borderColor: "rgba(7, 7, 7, 0.199)",
            }}
          />
          {distinctDepartments.map((course: string, index: number) => (
            <ListItem key={index}>
              <IconButton>
                <Avatar sx={AvatarSize}>
                  <Typography>{course.split(" ")[0]}</Typography>
                </Avatar>
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Drawer>
  );
};

export default SideBar;
