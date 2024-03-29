import "./App.css";
import ProtectedRoutes from "./component/ProtectedRoutes";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import About from "./pages/About";
import MissingRoute from "./pages/MissingRoute";
import PersistLogin from "./component/PersistLogin";
import Register from "./pages/Register";
import ChooseThreads from "./component/Register/ChooseThreads";
import Policies from "./pages/Policies";
import ProfilePage from "./pages/ProfilePage";
import RoomDisplay from "./component/ThreadDisplay/containers/RoomDisplay";
import AppealsDisplay from "./component/ThreadDisplay/containers/AppealsDisplay";
import QADisplay from "./component/ThreadDisplay/containers/QADisplay";
import Blocklist from "./pages/Blocklist";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./globals/mui";
import { darkTheme, lightTheme } from "./assets/theme";
import { useAuth } from "./context/context";
import NotificationPreference from "./component/Notification/NotificationPreference";
import PasswordReset from "./component/Settings/PasswordReset";
import { ShowPollList } from "./component/Polling/poll";

function App() {
  const { themeSetting } = useAuth();
  var themeObject = lightTheme;
  if (themeSetting == "dark") {
    themeObject = darkTheme;
  }
  return (
    <ThemeProvider theme={themeObject}>
      <div className="appDisplay">
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/chooseThreads" element={<ChooseThreads />} />
              <Route path="/profile/:requestUsername" element={<ProfilePage />} />
              <Route path="/settings" element={<Settings />}>
                <Route path="passwordReset" element={<PasswordReset />} />
                {/* <Route path="notification" element={<NotificationPreference />} /> */}
              </Route>
              <Route path="/home/courses" element={<Home />} />
              <Route path="/home" element={<Home />}>
                <Route path="courses/:courseId/:roomId" element={<RoomDisplay />} />
                <Route path="courses/:courseId/Appeals" element={<AppealsDisplay />} />
                <Route path="courses/:courseId/Q&A" element={<QADisplay />} />
                <Route path="courses/:courseId/Polls" element={<ShowPollList />} />
              </Route>
              <Route path="/blocklist" element={<Blocklist />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<MissingRoute />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
