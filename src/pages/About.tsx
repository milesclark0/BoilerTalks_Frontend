import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { Alert, AppBar, Box, Button, Drawer, FormHelperText, FormLabel, IconButton, InputAdornment, Stack, Toolbar, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import WarningIcon from "@mui/icons-material/Warning";
import { ChangePasswordAPI } from "../API/RegisterAPI";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';

const About = () => {
  const { user } = useAuth();
  const api = useAxiosPrivate();

  const [settingsPage, setSettingsPage] = useState<string>('Password');

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
    navigate("/home")
  }


return (
    <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ width: `calc(100%)`, ml: `${drawerWidth}px`, height: appBarHeight, alignContent: "center"}}>
          <Toolbar>
            <Typography variant="h5" sx={{p:4}}>{"About"}</Typography>
            <Button sx={{color: "white"}}onClick={navigateToHome}>Home</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{marginTop:`${appBarHeight}px` , paddingTop: '40px', paddingLeft: '40px'}}>
          <Box sx={{display: "inline-flex"}}>
            <Typography variant="h5">Jeff</Typography>
            <Link to={"https://github.com/wang4621"}>
              <IconButton sx={{paddingTop: "3px"}}><GitHubIcon /></IconButton>
            </Link>
          </Box>
          <Typography variant="body2" sx={{fontStyle: 'italic', textDecorationLine: 'underline'}}>wang4621@purdue.edu</Typography>
          <Typography sx={{paddingBottom: "30px"}} variant="body2">My name is Jeff.</Typography>
          
          <Box sx={{display: "inline-flex"}}>
            <Typography variant="h5">Samuel</Typography>
            <Link to={"https://github.com/sboynton1"}>
              <IconButton sx={{paddingTop: "3px"}}><GitHubIcon /></IconButton>
            </Link>
          </Box>
          <Typography variant="body2" sx={{fontStyle: 'italic', textDecorationLine: 'underline'}}>sboynton@purdue.edu</Typography>
          <Typography sx={{paddingBottom: "30px"}} variant="body2">I am a senior majoring Software Engineering and I like playing basketball in my free time.</Typography>

          <Box sx={{display: "inline-flex"}}>
            <Typography variant="h5">Katie</Typography>
            <Link to={"https://github.com/oneKZhang"}>
              <IconButton sx={{paddingTop: "3px"}}><GitHubIcon /></IconButton>
            </Link>
          </Box>
          <Typography variant="body2" sx={{fontStyle: 'italic', textDecorationLine: 'underline'}}>zhan3461@purdue.edu</Typography>
          <Typography sx={{paddingBottom: "30px"}} variant="body2">Hi my name is Katie and I am a senior in computer science.</Typography>

          <Box sx={{display: "inline-flex"}}>
            <Typography variant="h5">Miles</Typography>
            <Link to={"https://github.com/milesclark0"}>
              <IconButton sx={{paddingTop: "3px"}}><GitHubIcon /></IconButton>
            </Link>
          </Box>
          <Typography variant="body2" sx={{fontStyle: 'italic', textDecorationLine: 'underline'}}>clark658@purdue.edu</Typography>
          <Typography sx={{paddingBottom: "30px"}} variant="body2">I have a deep passion for password encryption.</Typography>

          <Box sx={{display: "inline-flex"}}>
            <Typography variant="h5">Christopher</Typography>
            <Link to={"https://github.com/cgbradley"}>
              <IconButton sx={{paddingTop: "3px"}}><GitHubIcon /></IconButton>
            </Link>
          </Box>
          <Typography variant="body2" sx={{fontStyle: 'italic', textDecorationLine: 'underline'}}>bradle82@purdue.edu</Typography>
          <Typography sx={{paddingBottom: "30px"}} variant="body2">Hi my name is Christopher and I am a senior in computer science.</Typography>
    
        </Box>
        
    </Box>
  );

};


export default About;