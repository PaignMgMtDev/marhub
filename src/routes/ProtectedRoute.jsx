import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth()
  if (!auth) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};