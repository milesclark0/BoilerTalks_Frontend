import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({auth}) => {
  return auth ? <Outlet /> : <Navigate to="/auth/login" />;
}

export default ProtectedRoutes