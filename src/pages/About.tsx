import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import WarningIcon from "@mui/icons-material/Warning";
import { ChangePasswordAPI } from "../API/RegisterAPI";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { shadows } from "@mui/system";

const About = () => {
  const { user } = useAuth();
  const api = useAxiosPrivate();

  const [settingsPage, setSettingsPage] = useState<string>("Password");

  const [selectedId, setSelectedId] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState<string>(null);
  const [selectedGithub, setSelectedGithub] = useState<string>(null);

  const defaultPadding = 4;
  const drawerWidth = 300;
  const innerDrawerWidth = 85;
  const appBarHeight = 64;

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

  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/home");
  };

  const devs = [
    {
      id: "0",
      title: "Jeff",
      email: "wang4621@purdue.edu",
      caption: "My name is Jeff.",
      github: "https://github.com/wang4621",
      picture:
        "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Jeff",
    },
    {
      id: "1",
      title: "Sam",
      email: "sboynton@purdue.edu",
      caption: "Senior in Software Engineering",
      github: "https://github.com/sboynton1",
      picture:
        "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Sam",
    },
    {
      id: "2",
      title: "Chris",
      email: "bradle82@purdue.edu",
      caption: "Hello my name is Chris",
      github: "https://github.com/cgbradley",
      picture:
        "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Chris",
    },
    {
      id: "3",
      title: "Katie",
      email: "zhan3461@purdue.edu",
      caption: "Hello my name is Katie",
      github: "https://github.com/oneKZhang",
      picture:
        "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Katie",
    },
    {
      id: "4",
      title: "Miles",
      email: "clark658@purdue.edu",
      caption: "Hello my name is Miles",
      github: "https://github.com/milesclark0",
      picture:
        "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Miles",
    },
  ];

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100%)`,
          ml: `${drawerWidth}px`,
          height: appBarHeight,
          alignContent: "center",
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ p: 4 }}>
            {"About"}
          </Typography>
          <Button sx={{ color: "white" }} onClick={navigateToHome}>
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Box flexGrow={1}>
        <Grid
          container
          wrap="nowrap"
          flexDirection="row"
          spacing={2}
          alignItems="center"
        >
          {devs.map((dev) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Box sx={{ margin: "15%" }}>
                <Card
                  sx={{
                    maxWidth: 345,
                    backgroundColor: "lightgrey",
                    marginTop: "80%",
                    border: "1px solid grey",
                    cursor: "pointer",
                    ":hover": {
                      border: "1px solid black",
                    },
                  }}
                  onClick={() => {setSelectedId(dev.id); setSelectedCaption(dev.caption); setSelectedGithub(dev.github)}}>
                  <CardMedia
                    component="img"
                    height="240"
                    src={dev.picture}
                    alt="ProfilePicture"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {dev.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Learn More
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)}>
        <DialogTitle sx={{alignContent: 'center'}}>About Me</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedCaption}</DialogContentText>
          <Link to={selectedGithub}>
            <IconButton><GitHubIcon /></IconButton>
          </Link>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default About;
