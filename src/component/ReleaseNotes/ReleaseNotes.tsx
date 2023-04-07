import { Box, Typography } from '@mui/material'
import React from 'react'

const ReleaseNotes = () => {
  return (
    <Box sx={{ overflowY: "auto" }}>
      <Typography variant="h5">Release Notes</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        v1.0.2
      </Typography>
      <Typography variant="body1">- Added more functionality for mods.</Typography>
      <Typography variant="body1">
        &nbsp;&nbsp;&nbsp;&nbsp;- Mods can now warn/ban a user.
      </Typography>
      <Typography variant="body1">
        &nbsp;&nbsp;&nbsp;&nbsp;- Mods can view appeals from banned users.
      </Typography>
      <Typography variant="body1">- Added messaging for different threads.</Typography>
      <Typography variant="body1">- Users can now block other users.</Typography>
      <Typography variant="body1">- Added dark and light mode.</Typography>
      <Typography variant="body1">- Users can now react/reply to other users messages.</Typography>
      <Typography variant="body1">- Added ability to upload profile picture.</Typography>
      <Typography variant="body1">
        - Users can report any problems with a thread/inappropriate behavior.
      </Typography>
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
    </Box>
  );
}

export default ReleaseNotes