import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";

const ProtectRoute = ({ children, isPublic = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (isPublic) {
    return children;
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  isPublic: PropTypes.bool,
};

export default ProtectRoute;
