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

function App() {
  return (
    // <ThemeProvider theme={theme}>
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/home/courses/:courseId/:roomId" element={<Home />} />
            <Route path="/home/courses" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<MissingRoute />} />
      </Routes>
    </div>

    //</ThemeProvider>
  );
}

export default App;
