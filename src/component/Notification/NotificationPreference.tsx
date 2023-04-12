// This file is used for notification preference for a thread.
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/context";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  Alert,
} from "@mui/material";
import { getProfileURL } from "../../API/ProfileAPI";
import { Profile } from "../../globals/types";
import { LoadingButton } from "@mui/lab";
import { updateNotificationPreferenceURL } from "../../API/ProfileAPI";

type NotificationPreference = {
  courseName: string;
  messages: boolean;
  appeals: boolean;
  reports: boolean;
};

type Props = {
  openNoti: boolean;
  setOpenNoti: React.Dispatch<React.SetStateAction<boolean>>;
  courseName: string;
};

const NotificationPreference = ({ openNoti, setOpenNoti, courseName }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<Profile>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageNoti, setMessageNoti] = useState<boolean>(false);
  const [appealNoti, setAppealNoti] = useState<boolean>(false);
  const [reportNoti, setReportNoti] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);

  useEffect(() => {
    // retrieve user notification preference
    const fetchProfile = async () => {
      const res = await axiosPrivate.get(getProfileURL + user?.username);
      if (res.status === 200) {
        if (res.data.statusCode === 200) {
          const notificationCourses = res.data.data[0]["notificationPreference"][courseName];
          setMessageNoti(notificationCourses["messages"]);
          setAppealNoti(notificationCourses["appeals"]);
          setReportNoti(notificationCourses["reports"]);
          setProfileData(res.data.data[0]);
        }
      }
    };
    fetchProfile();
    // setSaveSuccess(false);
    // setSaveError(false);
  }, []);

  useEffect(() => {
    setSaveSuccess(false);
    setSaveError(false);
  }, [openNoti]);

  const saveNotificationPreference = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.post(updateNotificationPreferenceURL + user.username, {
        courseName: courseName,
        data: {messages: messageNoti, appeals: appealNoti, reports: reportNoti}
      });
      console.log(res);
      if (res.status == 200) {
        if (res.data.statusCode == 200) {
          setSaveSuccess(true);
        } else {
          setSaveError(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleMessageSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageNoti(event.target.checked);
  };

  const handleAppealSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppealNoti(event.target.checked);
  };

  const handleReportSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReportNoti(event.target.checked);
  };

  const handleCloseNoti = () => {
    setOpenNoti(false);
  };

  return (
    <Dialog open={openNoti}>
      {saveSuccess && (
        <Alert
          onClose={() => {
            setSaveSuccess(false);
          }}
          severity="success"
        >
          Updated notification preference.
        </Alert>
      )}
      {saveError && (
        <Alert
          onClose={() => {
            setSaveError(false);
          }}
          severity="error"
        >
          Error occurred while updating notification preference. Please try again later.
        </Alert>
      )}
      <DialogTitle>Notification Settings</DialogTitle>
      <DialogContent>
        <Typography>Select the kinds of notifications you get for {courseName}.</Typography>
        <Typography sx={{ mt: 2 }}>
          Messages
          <Switch checked={messageNoti} onChange={handleMessageSwitch} color="warning" />
        </Typography>
        {profileData?.modThreads.includes(courseName) && (
          <Typography>
            Appeals
            <Switch
              checked={appealNoti}
              onChange={handleAppealSwitch}
              color="warning"
              sx={{ ml: 2 }}
            />
          </Typography>
        )}
        {profileData?.modThreads.includes(courseName) && (
          <Typography>
            Reports
            <Switch
              checked={reportNoti}
              onChange={handleReportSwitch}
              color="warning"
              sx={{ ml: 2 }}
            />
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseNoti}>Close</Button>
        <LoadingButton variant="contained" onClick={saveNotificationPreference} loading={loading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationPreference;
