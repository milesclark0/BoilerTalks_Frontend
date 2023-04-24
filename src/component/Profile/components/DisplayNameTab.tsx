import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { User, Profile } from "../../../globals/types";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { changeDisplayNameURL } from "../../../API/ProfileAPI";
import { useAuth } from "../../../context/context";
interface Props {
  viewedUser: User;
  profileInfo: Profile;
  setProfileInfo: React.Dispatch<React.SetStateAction<Profile>>;
}
const DisplayNameTab = ({ viewedUser, profileInfo, setProfileInfo }: Props) => {
  const [displayName, setDisplayName] = React.useState(profileInfo.displayName);
  const { setProfile, profile } = useAuth();
  const api = useAxiosPrivate();

  const handleSubmit = async () => {
    if (displayName === profileInfo.displayName) {
      alert("Display Name is unchanged");
      return;
    }
    const res = await api.post(changeDisplayNameURL + viewedUser?.username, { displayName });
    if (res.status === 200) {
      setProfileInfo((prev) => {
        return {
          ...prev,
          displayName,
        };
      });
      const newProfile = { ...profile, displayName };
      setProfile(newProfile);
      alert("Display Name updated successfully");
    }
  };
  return (
    <Box>
      <Typography variant="h5">Display Name Change</Typography>
      <Typography sx={{ mb: 3 }}>Please keep names appropriate for your fellow Purdue students </Typography>
      <Typography variant="h6">Current Display Name:</Typography>
      <Typography variant="h6" sx={{ mb: 3, color: "secondary.main" }}>
        {profileInfo.displayName}
      </Typography>
      <Typography variant="h6">New Display Name:</Typography>
      <Stack direction={"row"} alignItems={"center"}>
        <TextField value={displayName} size={"small"} onChange={(e) => setDisplayName(e.target.value)} sx={{ pr: 1 }} />
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default DisplayNameTab;
