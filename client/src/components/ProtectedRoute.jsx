// bounces back to /login if you're not logged in, or logged in with the wrong role
import { Navigate } from "react-router-dom";

function ProtectedRoute({ currentUser, allowedRoles, children }) {
  if (!currentUser || (!allowedRoles.includes(currentUser.role) && currentUser.role !== "admin")) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
