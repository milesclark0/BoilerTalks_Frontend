import './App.css'
import React, { useState, useEffect } from "react";
import ProtectedRoutes from "./component/ProtectedRoutes/ProtectedRoutes";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { LoginContext } from "./context/context";
import { User } from "./types/types";

function App() {
  const [auth, setAuth] = useState(false);
  const [username, setUserName] = useState("");
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <LoginContext.Provider value={{ user, setUser }}>
      <div className="appDisplay">
        <Routes>
          <Route path="/" element={<Login setAuth={setAuth} />} />
          <Route element={<ProtectedRoutes auth={auth} />}>
            {/* <Route path="/*" element={<Login setAuth={setAuth}/>} /> */}
            {/* element={<MainPage username={username} setAuth={setAuth} />} */}
          </Route>
        </Routes>
      </div>
    </LoginContext.Provider>
  );
}

export default App
