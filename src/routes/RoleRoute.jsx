import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ children, role, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Check if user has required role (single role or multiple roles)
  const hasRequiredRole = role 
    ? user.role === role 
    : roles && roles.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RoleRoute;