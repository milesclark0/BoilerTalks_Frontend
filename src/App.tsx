import "./App.css";
import React, { useState, useEffect } from "react";
import ProtectedRoutes from "./component/ProtectedRoutes";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { User } from "./types/types";
import MissingRoute from "./component/MissingRoute";
import PersistLogin from "./component/PersistLogin";

function App() {
  return (
    <div className="appDisplay">
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<MissingRoute />} />
      </Routes>
    </div>
  );
}

export default App;
