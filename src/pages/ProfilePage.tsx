import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import { getProfileURL } from "../API/ProfileAPI";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Profile } from "../types/types";
import EditBioModal from "../component/Profile.tsx/EditBioModal";
import { useParams } from "react-router-dom";


const ProfilePage = () => {
    const { requestUsername } = useParams();
    const { user } = useAuth()
    const [showEditBio, setShowEditBio] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [profileInfo, setProfileInfo] = useState<Profile>(null);
    const axiosPrivate = useAxiosPrivate();

    const defaultPadding = 4;
    const drawerWidth = 300;
    const innerDrawerWidth = 85;
    const appBarHeight = 64;

    //change this to use axiosprivate
    const fetchProfile = async () => {
        console.log(requestUsername);
        return await axiosPrivate.get(getProfileURL + requestUsername);
    }; 

    const { isLoading, error, data } = useQuery("profile", fetchProfile, {
        enabled: true,
        staleTime: 1000 * 60, //1 minute
        onSuccess: (data) => {
          if (data.data.statusCode === 200) {

            setProfileInfo(data.data.data);
          } else setFetchError(data.data.message);
        },
        onError: (error: string) => console.log(error),
    });

    const editBioProps = {
        requestUsername,
        showEditBio,
        setShowEditBio,
    };

    //add a back button
    return (
        <Box sx={{ display: "flex" }}>
            <EditBioModal {...editBioProps} />

            {!isLoading && !error && !fetchError ? (
                <Box>
                    <AppBar position="fixed" sx={{  ml: `${drawerWidth}px`, height: appBarHeight, alignContent: "center"}}>
                    <Typography variant="h4">{profileInfo?.username}</Typography>
                    <Box sx={{ display: "flex", margin: 5 }}>
                        <Box
                            sx={{
                            
                            boxShadow: 8,
                            height: "75%",
                            width: "55%",
                            borderRadius: 5,                     
                            justifyContent: "center",
                            alignItems: "initial",
                            flexDirection: "column",
                            margin: "auto",
                            padding: "1%",
                            // "& > :not(style)": { m: 1 },
                            }}>
                        <Typography variant="h3" 
                            sx={{
                                color: "black",
                                marginLeft: 5,
                                display: "table-caption"
                            }}
                        >{profileInfo?.bio}</Typography>
                        </Box>
                    </Box>

                    {user.username == requestUsername ? 
                        (<Button variant="contained" onClick={() => setShowEditBio(true) }sx={{
                            color: "white",
                            marginTop: 0,
                            marginLeft: 90,
                            marginRight: 90,
                        }}>
                        Edit Bio
                        </Button>) : (<h4></h4>)}
                    <h2>{profileInfo?.modThreads}</h2>
                    </AppBar>
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
}

export default ProfilePage;