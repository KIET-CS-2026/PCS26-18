import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAuthQuery } from "../hooks/useAuthQuery";
import PropTypes from "prop-types";

const ProtectRoute = ({ children }) => {
  const { user } = useAuth();
  const { isLoading, isError } = useAuthQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
ProtectRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectRoute;
