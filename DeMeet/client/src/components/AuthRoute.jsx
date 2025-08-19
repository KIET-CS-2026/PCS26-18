import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthStore from "../store/authStore";
import { useAuthService } from "@/services/user/hooks";

const AuthRoute = ({ children }) => {
  const { useCurrentUser } = useAuthService();

  useCurrentUser();
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;
