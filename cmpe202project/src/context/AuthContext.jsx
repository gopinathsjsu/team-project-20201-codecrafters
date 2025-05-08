import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

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
    // Skip interceptor setup if no user
    if (!user) return;

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if error is 401, we're not already refreshing, and we haven't tried refreshing this request
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          user?.refreshToken &&
          !isRefreshing &&
          // Add a cooling period - no more than one refresh every 5 seconds
          Date.now() - lastRefreshTime > 5000
        ) {
          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
            console.log("Attempting to refresh token...");
            const response = await axios.post(`${BASE_URL}/refreshToken`, {
              refreshToken: user.refreshToken,
            });

            const accessToken = response.data.token;

            if (!accessToken) {
              console.error("Invalid refresh response:", response.data);
              logout();
              setIsRefreshing(false);
              return Promise.reject(
                new Error("Invalid token refresh response")
              );
            }

            // Update timestamps and state
            setLastRefreshTime(Date.now());

            const newUser = { ...user, accessToken };
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

            // Update the authorization header for the original request
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            // Reset refreshing flag
            setIsRefreshing(false);

            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            setIsRefreshing(false);
            logout();
            return Promise.reject(refreshError);
          }
        }

        // If we already tried refreshing or there's another issue, reject the promise
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptor when component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, [user, isRefreshing, lastRefreshTime]);

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
    window.location.href = "/";
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
