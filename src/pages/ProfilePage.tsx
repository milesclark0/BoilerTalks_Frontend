import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import { getProfileURL, uploadProfilePictureURL } from "../API/ProfileAPI";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Avatar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Profile, User } from "../types/types";
import EditBioModal from "../component/Profile/EditBioModal";
import { useLocation, useParams } from "react-router-dom";
import React from "react";

const ProfilePage = () => {
  const { requestUsername } = useParams();
  const { user, setUser } = useAuth();
  const [showEditBio, setShowEditBio] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [profileInfo, setProfileInfo] = useState<Profile>(null);
  const [viewedUser, setViewedUser] = useState<User>(null);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const defaultPadding = 4;
  const drawerWidth = 300;
  const innerDrawerWidth = 85;
  const appBarHeight = 64;

  console.log(location);
  
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

  const uploadProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files[0];
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

  const editBioProps = {
    requestUsername,
    showEditBio,
    setShowEditBio,
  };

  const GetProfilePicture = () => {
    return <Avatar sx={{ width: 50, height: 50, m: 2 }} src={viewedUser?.profilePicture + `?${Date.now()}`} />;
  };

  //add a back button
  return (
    <Box sx={{ display: "flex" }}>
      <EditBioModal {...editBioProps} />

      {!isLoading && !error && !fetchError ? (
        <Box>
          <AppBar position="fixed" sx={{ height: appBarHeight }}>
            <Toolbar>
              <GetProfilePicture />
              <Typography variant="h4">{profileInfo?.username}</Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ display: "flex", margin: 5, mt: `${appBarHeight}px`, justifyContent: "center" }}>
            <Box
              sx={{
                boxShadow: 8,
                borderRadius: 1,
                width: 400,
                height: 100,
                margin: "auto",
                // "& > :not(style)": { m: 1 },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "black",
                }}
              >
                {profileInfo?.bio}
              </Typography>
            </Box>
          </Box>

          {user?.username == requestUsername ? (
            <Box sx={{ m: 5 }}>
              <Button
                variant="contained"
                onClick={() => setShowEditBio(true)}
                sx={{
                  color: "white",
                }}
              >
                Edit Bio
              </Button>
              <Button
                variant="contained"
                component="label"
                sx={{
                  color: "white",
                }}
              >
                Upload Profile Picture
                <input type="file" hidden accept="image/*" onChange={uploadProfilePicture} />
              </Button>
            </Box>
          ) : null}
          <h2>{profileInfo?.modThreads}</h2>
        </Box>
      ) : (
        <Box sx={{ padding: defaultPadding, paddingLeft: `${drawerWidth + 4 * defaultPadding}px` }}>
          {isLoading ? <Typography variant="h4">Loading...</Typography> : null}
          {error ? <Typography variant="h4">Error: {error}</Typography> : null}
          {fetchError ? <Typography variant="h4">Error: {fetchError}</Typography> : null}
        </Box>
      )}
    </Box>
  );
};

export default ProfilePage;
