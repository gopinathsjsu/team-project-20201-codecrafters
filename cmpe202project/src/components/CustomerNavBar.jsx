import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/CustomerNavBar.css";

const CustomerNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage after logout
  };

  const handleLoginClick = (e) => {
    // Save current path to localStorage before navigating to login
    if (
      location.pathname !== "/login" &&
      location.pathname !== "/signup" &&
      !location.pathname.includes("forgot-password")
    ) {
      localStorage.setItem("loginReferrer", location.pathname);
    }
  };

  return (
    <nav className="customer-navbar">
      <div className="navbar-logo">
        <Link to="/">Restaurant Finder</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {user ? (
          <>
            <Link to="/reservations">My Reservations</Link>
            <div className="user-menu">
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" onClick={handleLoginClick} className="login-btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavBar;
