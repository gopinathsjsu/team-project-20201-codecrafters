import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  console.log('useAuth', useAuth())

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role is specified and user doesn't have that role, redirect to home
  if (role && !hasRole(role)) {
    console.log('no role?')
    return <Navigate to="/" />;
  }

  // If authenticated and has the required role, render the children
  return children;
};

export default ProtectedRoute;
