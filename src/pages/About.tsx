import { useAuth } from "context/context";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useState } from "react";
import {
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
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "globals/mui";
import { Link, useNavigate } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

const About = () => {
  const { user } = useAuth();
  const api = useAxiosPrivate();

  const [settingsPage, setSettingsPage] = useState<string>("Password");

  const [selectedId, setSelectedId] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState<string>(null);
  const [selectedGithub, setSelectedGithub] = useState<string>(null);

  const defaultPadding = 4;
  const drawerWidth = 320;
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
      picture: "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Jeff",
    },
    {
      id: "1",
      title: "Sam",
      email: "sboynton@purdue.edu",
      caption: "If I had a dollar for every time I got distracted, I wish I had some ice cream.",
      github: "https://github.com/sboynton1",
      picture: "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Sam",
    },
    {
      id: "2",
      title: "Chris",
      email: "bradle82@purdue.edu",
      caption: "Somebody threw a rock at my window.",
      github: "https://github.com/cgbradley",
      picture: "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Chris",
    },
    {
      id: "3",
      title: "Katie",
      email: "zhan3461@purdue.edu",
      caption: "Graphic design is my passion",
      github: "https://github.com/oneKZhang",
      picture: "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Katie",
    },
    {
      id: "4",
      title: "Miles",
      email: "clark658@purdue.edu",
      caption: "Hooper and a coder.",
      github: "https://github.com/milesclark0",
      picture: "https://boilertalks-profile-images.s3.amazonaws.com/DevProfile-Miles",
    },
  ];

  return (
    <Paper sx={{ height: "102vh" }}>
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
        <Grid container wrap="nowrap" flexDirection="row" spacing={2} alignItems="center">
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
                  onClick={() => {
                    setSelectedId(dev.id);
                    setSelectedCaption(dev.caption);
                    setSelectedGithub(dev.github);
                  }}
                >
                  <CardMedia component="img" height="240" src={dev.picture} alt="ProfilePicture" />
                  <CardContent sx={{ backgroundColor: "primary.main" }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {dev.title}
                    </Typography>

                    <Typography variant="body2" color="text.primary" align="center">
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
        <DialogTitle sx={{ alignContent: "center" }}>About Me</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.primary" }}>{selectedCaption}</DialogContentText>
          <Link to={selectedGithub}>
            <Box sx={{ display: "inline-flex" }}>
              <IconButton size="large">
                <GitHubIcon />
              </IconButton>
              <Typography sx={{ paddingTop: "12px" }}>Check out my github!</Typography>
            </Box>
          </Link>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default About;
