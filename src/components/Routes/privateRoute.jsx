import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// PrivateRoute menerima props "roles"
const PrivateRoute = ({ roles, children }) => {
  const [auth, setAuth] = useState({ loading: true, authorized: false, role_id: null });
  const location = useLocation();

  useEffect(() => {
    const validateRoute = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/admin/verify", {
          withCredentials: true,
        });

        setAuth({
          loading: false,
          authorized: true,
          role_id: data.role_id,
        });
      } catch (error) {
        setAuth({ loading: false, authorized: false, role_id: null });
      }
    };

    validateRoute();
  }, []);

  if (auth.loading) return <div>Loading...</div>;

  if (!auth.authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const roleMap = {
      1: "user",
      2: "admin",
      3: "superadmin",
    };

    const userRole = roleMap[auth.role_id];

    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};


export default PrivateRoute;
