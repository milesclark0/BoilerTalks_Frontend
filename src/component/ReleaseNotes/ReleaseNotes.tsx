import { Box, CardContent, CardHeader, Paper, Typography } from "globals/mui";
import React from "react";
import { StyledDivider } from "component/SideBar/components/StyledDivider";

const ReleaseNotes = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader title="Release Notes" sx={{ textAlign: "center" }} />
      <StyledDivider />
      <CardContent sx={{ overflowY: "auto", mb: 2 }} className="scrollBar">
        <Typography variant="body1" sx={{ mt: 2 }}>
          v1.0.3
        </Typography>
        <Typography variant="body1">- Added notifications for different coursees.</Typography>
        <Typography variant="body1">- Added ability to change notification preference within a course.</Typography>
        <Typography variant="body1">- Added ability to edit sent message.</Typography>
        <Typography variant="body1">- Added ability to delete sent message.</Typography>
        <Typography variant="body1">- Users can now send a poll to a room.</Typography>
        <Typography variant="body1">- Cleaned up UI for profile page.</Typography>
        <Typography variant="body1">- Fixed light mode and dark mode color palette.</Typography>
        <Typography variant="body1">- Moderators can now filter in reports.</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          v1.0.2
        </Typography>
        <Typography variant="body1">- Added more functionality for mods.</Typography>
        <Typography variant="body1">&nbsp;&nbsp;&nbsp;&nbsp;- Mods can now warn/ban a user.</Typography>
        <Typography variant="body1">&nbsp;&nbsp;&nbsp;&nbsp;- Mods can view appeals from banned users.</Typography>
        <Typography variant="body1">- Added messaging for different threads.</Typography>
        <Typography variant="body1">- Users can now block other users.</Typography>
        <Typography variant="body1">- Added dark and light mode.</Typography>
        <Typography variant="body1">- Users can now react/reply to other users messages.</Typography>
        <Typography variant="body1">- Added ability to upload profile picture.</Typography>
        <Typography variant="body1">- Users can report any problems with a thread/inappropriate behavior.</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          v1.0.1
        </Typography>
        <Typography variant="body1">- Added navigation to courses.</Typography>
        <Typography variant="body1">- Added ability to subscribe to courses.</Typography>
        <Typography variant="body1">- Created backend for web application.</Typography>
        <Typography variant="body1">- Made accounts more secure with hashing passwords.</Typography>
        <Typography variant="body1">- Added login/sign up.</Typography>
        <Typography variant="body1">- Users can now view profile.</Typography>
        <Typography variant="body1">- Added ability to leave a thread.</Typography>
        <Typography variant="body1">- Added ability to modify rules for a thread.</Typography>
        <Typography variant="body1">- Added "About" page about the creators.</Typography>
      </CardContent>
    </Box>
  );
};

export default ReleaseNotes;
