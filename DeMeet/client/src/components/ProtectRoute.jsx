import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";
import { useAuthService } from "@/services/user/hooks";

const ProtectRoute = ({ children, isPublic = false }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  const { useCurrentUser } = useAuthService();

  useCurrentUser();

  if (isPublic) {
    return children;
  }

  if (user) {
  return children;
  }

  if (!user) {
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
