import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on initial render
  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set axios default header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.accessToken}`;
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          user?.refreshToken
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await axios.post(`${BASE_URL}/refresh`, {
              refreshToken: user.refreshToken,
            });

            const { accessToken, refreshToken } = response.data;

            // Update user in state and storage
            const newUser = { ...user, accessToken, refreshToken };
            const storage = localStorage.getItem("user")
              ? localStorage
              : sessionStorage;
            storage.setItem("user", JSON.stringify(newUser));
            storage.setItem("authToken", accessToken);

            // Update axios default header
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;

            // Update user in state
            setUser(newUser);

            // Retry the original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh token fails, logout user
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptor when component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, [user]);

  const login = async (email, password, rememberMe) => {
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const { accessToken, refreshToken, role } = response.data;

    const userData = { email, accessToken, refreshToken, role };

    // Store in localStorage or sessionStorage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("authToken", accessToken);

    // Set axios default header
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Update user in state
    setUser(userData);

    return userData;
  };

  const logout = () => {
    // Clear user from storage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");

    // Clear from state
    setUser(null);

    // Clear axios default header
    delete axios.defaults.headers.common["Authorization"];
  };

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Check if the user has a specific role
  const hasRole = (role) => {
    return user?.role?.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
