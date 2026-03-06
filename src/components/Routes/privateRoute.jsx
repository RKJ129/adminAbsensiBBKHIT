import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

// PrivateRoute menerima props "roles"
const PrivateRoute = ({ roles, children }) => {
  const { loading, isAuthenticated, userRole } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};


export default PrivateRoute;
