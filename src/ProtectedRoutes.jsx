import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType?.toLowerCase();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};
