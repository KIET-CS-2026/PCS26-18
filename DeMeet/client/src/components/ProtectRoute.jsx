import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";

const ProtectRoute = ({ children, isPublic = false }) => {
  const { user } = useAuth();
  const { isAuthenticated } = useAuthStore();
  const { isLoading, isError } = useAuthQuery();
  const location = useLocation();

  if (isPublic) {
    return children;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !user || !isAuthenticated) {
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
