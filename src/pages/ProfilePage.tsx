import { useAuth } from "../context/context";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import useLogout from "../hooks/useLogout";
import SearchCourseModal from "../component/ThreadDisplay/searchCourseModal";
import { editProfileURL, getProfileURL, uploadProfilePictureURL } from "../API/ProfileAPI";
import SideBar from "../component/HomePage/components/sideBar";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Icon,
  IconButton,
  IconButtonProps,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { Profile, User, ClassYear } from "../globals/types";
import EditBioModal from "../component/Profile/EditBioModal";
import { useLocation, useParams } from "react-router-dom";
import React from "react";
import { APP_STYLES } from "../globals/globalStyles";
import { Edit, Close, Check } from "@mui/icons-material";

interface GridProps {
  viewedUser: User;
  profileInfo: Profile;
  uploadProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoggedUserProfile: boolean;
  setProfileInfo: React.Dispatch<React.SetStateAction<Profile>>;
  image: string;
}

const ProfilePage = () => {
  const { requestUsername } = useParams();
  const { user, setUser } = useAuth();
  const [showEditBio, setShowEditBio] = useState(false);
  const [fetchError, setFetchError] = useState("");

  //the info for the users page
  const [profileInfo, setProfileInfo] = useState<Profile>(null);
  const [viewedUser, setViewedUser] = useState<User>(null);
  const [image, setImage] = useState<string>(null);

  const axiosPrivate = useAxiosPrivate();
  const defaultPadding = APP_STYLES.DEFAULT_PADDING;
  const drawerWidth = APP_STYLES.DRAWER_WIDTH;
  const innerDrawerWidth = APP_STYLES.INNER_DRAWER_WIDTH;
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
  };

  //add a back button
  return (
    <Paper sx={{ width: 1, height: 1, pt: `${appBarHeight}px` }}>
      {/* <EditBioModal {...editBioProps} /> */}
      {!isLoading && !error && !fetchError ? (
        <Box sx={{ p: 4 }}>
          <AppBar position="fixed" sx={{ height: appBarHeight }}>
            <Toolbar>
              {/* If display name is set, show it else show username */}
              <Typography variant="h4">Viewing {`${profileInfo?.displayName ? profileInfo?.displayName : profileInfo?.username}`}</Typography>
            </Toolbar>
          </AppBar>
          <Card id="view-profile-container" sx={{ p: 8, bgcolor: "primary.main", borderRadius: "2%" }}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <ProfileContainer {...gridProps} />
              </Grid>
              {/* Right side of view-profile-container */}
              <Grid item xs={8}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Item>xs=9</Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Item>xs=9</Item>
                  </Grid>
                </Grid>
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

const ProfileContainer = ({ uploadProfilePicture, viewedUser, isLoggedUserProfile, profileInfo, setProfileInfo, image }: GridProps) => {
  const { themeSetting } = useAuth();
  const [classYear, setClassYear] = useState<string>(null);
  const [major, setMajor] = useState<string>(null);
  const [bio, setBio] = useState<string>(null);

  const axiosPrivate = useAxiosPrivate();

  const updateProfile = async () => {
    console.log(bio, profileInfo?.bio, classYear, profileInfo?.classYear, major, profileInfo?.major)
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
  };

  return (
    <Card sx={{ borderRadius: "2%", p: 2 }}>
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
const ClassYearText = ({ classYear, setClassYear, profileInfo, updateProfile, infoStyle }) => {
  if (classYear === null) {
    return (
      <Box display={"flex"} sx={{ alignItems: "center" }}>
        {profileInfo?.classYear ? (
          <Typography variant="h6" sx={{ ...infoStyle }}>
            {profileInfo?.classYear}
          </Typography>
        ) : null}
        <EditButton onClick={() => setClassYear("")}></EditButton>
      </Box>
    );
  }
  return (
    <>
      <TextField
        sx={{ width: 100 }}
        label="Class Year"
        value={classYear ? classYear : profileInfo?.classYear}
        onChange={(e) => setClassYear(e.target.value)}
      />
      <CheckButton onClick={updateProfile}></CheckButton>
      <CancelButton onClick={() => setClassYear(null)}></CancelButton>
    </>
  );
};

const MajorText = ({ major, setMajor, profileInfo, updateProfile, infoStyle }) => {
  if (major === null) {
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
        <EditButton onClick={() => setMajor("")}></EditButton>
      </Box>
    );
  }
  return (
          <Box display={"flex"} sx={{ alignItems: "center" }}>
      <TextField label="Major" sx={{width: .8}}  value={major ? major : profileInfo?.major} onChange={(e) => setMajor(e.target.value)} />
      <CheckButton onClick={updateProfile}></CheckButton>
      <CancelButton onClick={() => setMajor(null)}></CancelButton>
    </Box>
  );
};

const BioText = ({ bio, setBio, profileInfo, updateProfile }) => {
  if (bio === null) {
    return (
      <Box display={"flex"} sx={{ alignItems: "center" }}>
        <Typography variant="body1">{profileInfo?.bio}</Typography>
        <EditButton onClick={() => setBio("")}></EditButton>
      </Box>
    );
  }
  return (
    <Box display={"flex"} alignItems={"center"}>
      <TextField multiline sx={{ width: 1 }} value={bio ? bio : profileInfo?.bio} onChange={(e) => setBio(e.target.value)} label="Bio" />
      <Stack direction={"column"}>
        <CheckButton onClick={updateProfile}></CheckButton>
        <CancelButton onClick={() => setBio(null)}></CancelButton>
      </Stack >
    </Box>
  );
};
const CancelButton = ({ ...props }: IconButtonProps) => {
  return (
    <IconButton onClick={props.onClick} {...props}>
      <Close />
    </IconButton>
  );
};
const CheckButton = ({ ...props }: IconButtonProps) => {
  return (
    <IconButton onClick={props.onClick} {...props}>
      <Check />
    </IconButton>
  );
};

const EditButton = ({ ...props }: IconButtonProps) => {
  return (
    <IconButton onClick={props.onClick} {...props}>
      <Edit />
    </IconButton>
  );
};

export default ProfilePage;
