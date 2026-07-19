// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// This component wraps any route(s) that require login.
// If auth is still being checked -> show a spinner.
// If not logged in -> redirect to /login, remembering where they were headed.
// If logged in -> render the actual page via <Outlet />.
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    // "state" carries the original destination so we can send the user
    // back there automatically after they successfully log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;