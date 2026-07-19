// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";

// Create the context object — this is the "container" that will hold
// our global auth state, accessible from any component without prop drilling.
const AuthContext = createContext();

// Custom hook — lets any component do `const { user } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage/token on first load

  // On first app load, check if a token already exists in localStorage
  // (i.e., the user was already logged in from a previous visit) and
  // verify it's still valid by calling /auth/me.
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("ff_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        // Token was invalid/expired — clear it out
        localStorage.removeItem("ff_token");
        localStorage.removeItem("ff_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Called after successful login/register API calls
  const login = (userData, token) => {
    localStorage.setItem("ff_token", token);
    localStorage.setItem("ff_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("ff_token");
    localStorage.removeItem("ff_user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user, // shorthand boolean: true if user object exists
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};