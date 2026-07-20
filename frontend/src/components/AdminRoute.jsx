// frontend/src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// Similar to ProtectedRoute, but with an EXTRA check: not just "logged in",
// but specifically "logged in AND isAdmin is true". Non-admins get bounced
// to the homepage instead of the login page, since they ARE logged in —
// they just don't have permission for this section.
const AdminRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;