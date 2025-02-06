// src/components/AuthRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAuthQuery } from "../hooks/useAuthQuery";
import PropTypes from "prop-types";

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useAuthQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // If user is authenticated, redirect to home or the page they came from
  if (user) {
    return (
      <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />
    );
  }

  return children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;
