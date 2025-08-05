import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";

const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

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
