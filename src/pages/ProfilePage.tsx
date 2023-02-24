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


const ProfilePage = () => {
    const { user } = useAuth();
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
        return await axiosPrivate.get(getProfileURL + user?.username);
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
        user,
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
                    <h2>{profileInfo?.bio}</h2>
                    <Button variant="outlined" onClick={() => setShowEditBio(true) }sx={{
                        color: "white",
                    }}>
                        Edit Bio
                    </Button>
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