import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/CustomerNavBar.css";

const CustomerNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to homepage after logout
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
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavBar;
