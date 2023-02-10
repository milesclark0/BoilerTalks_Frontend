import "./App.css";
import React, { useState, useEffect } from "react";
import ProtectedRoutes from "./component/ProtectedRoutes/ProtectedRoutes";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./component/Register/Register";
import { LoginContext } from "./context/context";
import { User } from "./types/types";

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setAuth(true);
      if (location.pathname === "/") {
        navigate("/home");
      } else {
        navigate(location.pathname);
      }
    } else {
      navigate("auth/login");
    }
  }, []);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      <div className="appDisplay">
        <Routes>
          <Route path="auth/login" element={<Login setAuth={setAuth} />} />
          <Route path="auth/register" element={<Navigate to="/auth/login" replace />} />
          <Route element={<ProtectedRoutes auth={auth} />}>{/* <Route path="/*" element={<MainPage username={username} setAuth={setAuth} /> */}</Route>
        </Routes>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
