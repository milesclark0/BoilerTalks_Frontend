import { useAuth } from "../context/context";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/HomePage/searchCourseModal";
import { ShowProfile } from "../API/ProfileAPI";
import SideBar from "../component/HomePage/sideBar";
import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Profile } from "../types/types";


const ProfilePage = () => {
    const { user } = useAuth();
    const [showEditBio, setShowEditBio] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [profileInfo, setProfileInfo] = useState<Profile>(null);

    const defaultPadding = 4;

    const fetchProfile = async () => {
        console.log("trying to fetch profile...")
        return await ShowProfile(user?.username);
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
            <h1>This is the profile page I guess</h1> 
            {profileInfo?.username}
        </Box>
    );
}

export default ProfilePage;