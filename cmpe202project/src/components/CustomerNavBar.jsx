import React from "react";
import "../styles/CustomerNavBar.css";
import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/searchIcon.svg";

const CustomerNavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="customer-navbar">
      <div className="logo-container">Logo</div>
      <div className="search-login-container">
        <div className="search-bar">
          <img src={searchIcon} alt="search icon" />
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavBar;
