import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAuthQuery } from "../hooks/useAuthQuery";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useAuthQuery();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;
