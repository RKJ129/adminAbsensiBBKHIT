import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const roleMap = {
  1: 'user',
  2: 'admin',
  3: 'superadmin'
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    userRole: null
  });

  const verify = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:3000/api/admin/verify',
        { withCredentials: true }
      );

      setAuth({
        loading: false,
        isAuthenticated: true,
        userRole: roleMap[data.role_id]
      });
    } catch {
      setAuth({
        loading: false,
        isAuthenticated: false,
        userRole: null
      });
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const logout = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/logout', { withCredentials: true });
        setAuth({
          loading: false,
          isAuthenticated: false,
          role: null
        });
        // navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <AuthContext.Provider value={{...auth, verify, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
