import "./App.css";
import ProtectedRoutes from "./component/ProtectedRoutes";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MissingRoute from "./pages/MissingRoute";
import PersistLogin from "./component/PersistLogin";
import Register from "./pages/Register";
import ChooseThreads from "./component/Register/ChooseThreads";

function App() {
  return (
    
    // <ThemeProvider theme={theme}>
      <div className="appDisplay">

      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/chooseThreads" element={<ChooseThreads />} />
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
