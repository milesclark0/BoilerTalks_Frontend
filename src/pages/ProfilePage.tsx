import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { useQuery } from "react-query";
import { getProfileURL, uploadProfilePictureURL } from "../API/ProfileAPI";
import { Alert, AppBar, Box, Button, Card, Divider, Grid, Paper, Toolbar, Typography, styled } from "@mui/material";
import { Profile, User } from "../globals/types";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { APP_STYLES } from "../globals/globalStyles";
import { ProfileContainer } from "../component/Profile/ProfileContainer";
import ProfileTabBar from "../component/Profile/ProfileTabBar";

const ProfilePage = () => {
  const { requestUsername } = useParams();
  const { user, setUser } = useAuth();
  const [fetchError, setFetchError] = useState("");

  //the info for the users page
  const [profileInfo, setProfileInfo] = useState<Profile>(null);
  const [viewedUser, setViewedUser] = useState<User>(null);
  const [image, setImage] = useState<string>(null);
  const [changeMessage, setChangeMessage] = useState<string>(null);
  const [changeMessageSeverity, setChangeMessageSeverity] = useState<"success" | "error" | "info">("success");
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const defaultPadding = APP_STYLES.DEFAULT_PADDING;
  const drawerWidth = APP_STYLES.DRAWER_WIDTH;
  const appBarHeight = APP_STYLES.APP_BAR_HEIGHT;

  const fetchProfile = async () => {
    console.log(requestUsername);
    return await axiosPrivate.get(getProfileURL + requestUsername);
  };

  const { isLoading, error, data } = useQuery("profile", fetchProfile, {
    enabled: true,
    staleTime: 1000 * 60, //1 minute
    refetchOnMount: "always",
    onSuccess: (data) => {
      if (data.data.statusCode === 200) {
        setProfileInfo(data.data.data[0]);
        setViewedUser(data.data.data[1]);
      } else setFetchError(data.data.message);
    },
    onError: (error: string) => console.log(error),
  });

  //TODO: remove this
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const uploadProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axiosPrivate.post(uploadProfilePictureURL + user?.username, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.statusCode === 200) {
        console.log(response.data.data);
        setUser({ ...user, profilePicture: user?.profilePicture + `?${performance.now()}` });
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedUserProfile = user?.username === requestUsername;
  const gridProps = {
    viewedUser,
    profileInfo,
    uploadProfilePicture,
    isLoggedUserProfile,
    setProfileInfo,
    image,
    changeMessage,
    setChangeMessage,
    changeMessageSeverity,
    setChangeMessageSeverity,
  };

  //add a back button
  return (
    <Paper sx={{ width: 1, height: 1, pt: `${appBarHeight}px` }}>
      {/* <EditBioModal {...editBioProps} /> */}
      {profileInfo ? (
        <Box sx={{ p: 4 }}>
          <AppBar position="fixed" sx={{ height: appBarHeight }}>
            <Toolbar>
              {/* If display name is set, show it else show username */}
              <Typography variant="h5" sx={{ mr: 1 }}>
                Viewing {`${profileInfo?.displayName ? profileInfo?.displayName : profileInfo?.username}`}
              </Typography>
              <Divider orientation="vertical"></Divider>
              <Button onClick={() => navigate("/home")}>Back to Home</Button>
            </Toolbar>
          </AppBar>
          <Card id="view-profile-container" sx={{ p: 10, bgcolor: "primary.main", borderRadius: "2%",}}>
          <Alert
            severity={changeMessageSeverity}
            sx={{ visibility: changeMessage ? "visible" : "hidden", w: 1, mb: 1 }}
            onClose={() => setChangeMessage(null)}
          >
            {changeMessage}
          </Alert>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <ProfileContainer {...gridProps} />
              </Grid>
              {/* Right side of view-profile-container */}
              <Grid item xs={8}>
                <ProfileTabBar {...gridProps} />
                {/* <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Item>xs=9</Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Item>xs=9</Item>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          </Card>
        </Box>
      ) : (
        <Box sx={{ padding: defaultPadding, paddingLeft: `${drawerWidth + 4 * defaultPadding}px` }}>
          {isLoading ? <Typography variant="h4">Loading...</Typography> : null}
          {error ? <Typography variant="h4">Error: {error}</Typography> : null}
          {fetchError ? <Typography variant="h4">Error: {fetchError}</Typography> : null}
        </Box>
      )}
    </Paper>
  );
};

export default ProfilePage;
