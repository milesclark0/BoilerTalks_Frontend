import { Button, Card, Box, Stack, Typography, Avatar, TextField } from "@mui/material";
import React, { useState } from "react";
import { editProfileURL } from "../../API/ProfileAPI";
import { useAuth } from "../../context/context";
import { User, Profile, ClassYear } from "../../globals/types";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CancelButton, CheckButton, EditButton } from "./components";

interface GridProps {
  viewedUser: User;
  profileInfo: Profile;
  uploadProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedUserProfile: boolean;
  setProfileInfo: React.Dispatch<React.SetStateAction<Profile>>;
  image: string;
}
export const ProfileContainer = ({ uploadProfilePicture, viewedUser, isLoggedUserProfile, profileInfo, setProfileInfo, image }: GridProps) => {
  const { themeSetting } = useAuth();
  const [classYear, setClassYear] = useState<string>(null);
  const [major, setMajor] = useState<string>(null);
  const [bio, setBio] = useState<string>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();

  const updateProfile = async () => {
    console.log(bio, profileInfo?.bio, classYear, profileInfo?.classYear, major, profileInfo?.major);
    if (!bio && !classYear && !major) {
      alert("No changes made");
      return;
    }
    if (bio === profileInfo?.bio || classYear === profileInfo?.classYear || major === profileInfo?.major) {
      alert("No changes made");
      return;
    }
    const response = await axiosPrivate.post(editProfileURL + viewedUser?.username, {
      classYear,
      major,
      bio,
    });
    if (response.data.statusCode === 200) {
      alert(response.data.message);
      let c = classYear ? (classYear as ClassYear) : profileInfo?.classYear;
      let m = major ? (major as string) : profileInfo?.major;
      let b = bio ? (bio as string) : profileInfo?.bio;
      setProfileInfo({ ...profileInfo, classYear: c, major: m, bio: b });
    } else {
      alert(response.data.message);
    }
    setBio(null);
    setClassYear(null);
    setMajor(null);
  };

  const infoStyle = {
    opacity: themeSetting === "light" ? "0.7" : "0.5",
    fontFamily: "Sans Serif",
  };
  //button to upload profile picture
  const CustomFileInputButton = (props) => {
    const inputRef = React.useRef(null);

    const handleClick = () => {
      inputRef.current.click();
    };

    if (!isLoggedUserProfile) return null;
    return (
      <div>
        <Button variant="contained" onClick={handleClick}>
          Upload Profile Picture
        </Button>
        <input type="file" accept="image/*" style={{ display: "none" }} ref={inputRef} onChange={props.onChange} />
      </div>
    );
  };

  const genProps = {
    profileInfo,
    viewedUser,
    classYear,
    setClassYear,
    major,
    setMajor,
    bio,
    setBio,
    updateProfile,
    infoStyle,
    editMode,
  };

  function handleCancelEdit() {
    setEditMode(false);
    setBio(null);
    setClassYear(null);
    setMajor(null);
  }

  return (
    <Card sx={{ borderRadius: "2%", p: 2, height: "60vh" }}>
      <Box position={"relative"} display={"flex"}>
        <EditButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          viewedUser={viewedUser}
          isEditMode={!editMode}
          onClick={() => setEditMode(true)}
        ></EditButton>
        <Button sx={{ position: "absolute", top: 0, right: 0, visibility: editMode ? "visible" : "hidden" }} onClick={handleCancelEdit}>
          Cancel
        </Button>
      </Box>
      <Stack direction="column" alignItems="center" spacing={1}>
        <Typography variant="h4">{`${profileInfo?.displayName ? profileInfo?.displayName : profileInfo?.username}`}</Typography>
        <Typography variant="h6" style={{ ...infoStyle }}>{`${profileInfo?.username}`}</Typography>
        <Avatar sx={{ width: 200, height: 200 }} src={image || viewedUser?.profilePicture + `?${Date.now()}`} />
        <CustomFileInputButton onChange={uploadProfilePicture} />
        {/* Name */}
        <Typography variant="h5">
          {viewedUser?.firstName} {viewedUser?.lastName}
        </Typography>
        <Box display={"flex"}>
          {/* class year */}
          <ClassYearText {...genProps} />
          <MajorText {...genProps} />
        </Box>
        {/* email */}
        <Typography variant="h6" sx={{ ...infoStyle, pb: 3 }}>
          {viewedUser?.email}
        </Typography>
        {/* bio */}
        <BioText {...genProps} />
      </Stack>
    </Card>
  );
};
const ClassYearText = ({ classYear, setClassYear, profileInfo, updateProfile, infoStyle, editMode, viewedUser }) => {
  if (classYear === null || editMode === false) {
    return (
      <Box display={"flex"} sx={{ alignItems: "center" }}>
        {profileInfo?.classYear ? (
          <Typography variant="h6" sx={{ ...infoStyle }}>
            {profileInfo?.classYear}
          </Typography>
        ) : null}
        <EditButton isEditMode={editMode} viewedUser={viewedUser} onClick={() => setClassYear("")}></EditButton>
      </Box>
    );
  }
  return (
    <Box display={"flex"} sx={{ alignItems: "center" }}>
      <TextField
        sx={{ width: 100 }}
        label="Class Year"
        value={classYear ? classYear : profileInfo?.classYear}
        onChange={(e) => setClassYear(e.target.value)}
      />
      <CheckButton isEditMode={editMode} onClick={updateProfile}></CheckButton>
      <CancelButton isEditMode={editMode} onClick={() => setClassYear(null)}></CancelButton>
    </Box>
  );
};

const MajorText = ({ major, setMajor, profileInfo, updateProfile, infoStyle, editMode, viewedUser }) => {
  if (major === null || editMode === false) {
    return (
      <Box display={"flex"} sx={{ alignItems: "center" }}>
        <Typography variant="h6" sx={{ ...infoStyle, ml: 1, mr: 2 }}>
          |
        </Typography>
        {profileInfo?.major ? (
          <Typography variant="h6" sx={{ ...infoStyle, width: "150px" }} noWrap>
            {profileInfo?.major}
          </Typography>
        ) : null}
        <EditButton isEditMode={editMode} viewedUser={viewedUser} onClick={() => setMajor("")}></EditButton>
      </Box>
    );
  }
  return (
    <Box display={"flex"} sx={{ alignItems: "center" }}>
      <TextField label="Major" sx={{ width: 0.8 }} value={major ? major : profileInfo?.major} onChange={(e) => setMajor(e.target.value)} />
      <CheckButton isEditMode={editMode} onClick={updateProfile}></CheckButton>
      <CancelButton isEditMode={editMode} onClick={() => setMajor(null)}></CancelButton>
    </Box>
  );
};

const BioText = ({ bio, setBio, profileInfo, updateProfile, editMode, viewedUser }) => {
  if (bio === null || editMode === false) {
    return (
      <Box display={"flex"} sx={{ alignItems: "center" }}>
        <Typography variant="body1">{profileInfo?.bio}</Typography>
        <EditButton isEditMode={editMode} viewedUser={viewedUser} onClick={() => setBio("")}></EditButton>
      </Box>
    );
  }
  return (
    <Box display={"flex"} alignItems={"center"}>
      <TextField
        multiline
        value={bio ? bio : profileInfo?.bio}
        onChange={(e) => setBio(e.target.value)}
        label="Bio"
        style={{ width: "20vw" }} // Add this line
      />
      <Stack direction={"column"}>
        <CheckButton isEditMode={editMode} onClick={updateProfile}></CheckButton>
        <CancelButton isEditMode={editMode} onClick={() => setBio(null)}></CancelButton>
      </Stack>
    </Box>
  );
};
