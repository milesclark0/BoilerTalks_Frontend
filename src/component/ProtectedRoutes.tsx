import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "context/context";
import { useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoutes;
