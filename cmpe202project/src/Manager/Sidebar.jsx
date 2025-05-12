"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import SidebarNavItem from "./SidebarNavItem";



function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens, cookies)
    // Then navigate to the home page
    navigate("/");
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.navContainer}>
        <ul className={styles.navList}>
          <SidebarNavItem
            text="Dashboard"
            isActive={true}
            path="/manager/dashboard"
          />
          <SidebarNavItem
            text="Restaurant"
            isActive={false}
            path="/manager/restaurants"
          />

        </ul>
      </div>
      <div className={styles.profileSection}>
        <div className={styles.adminProfile}>
          <svg
            className={styles.adminAvatar}
            width="202"
            height="60"
            viewBox="0 0 202 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="29.5442"
              cy="29.5442"
              r="29.5442"
              fill="#CCCCCC"
            ></circle>
            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: "pre" }}
              fontFamily="Inter"
              fontSize="21.9864"
              fontWeight="600"
              letterSpacing="0px"
            >
              <tspan x="110.157" y="26.0392">
                Owner
              </tspan>
            </text>
            <text
              fill="#C8C8C8"
              xmlSpace="preserve"
              style={{ whiteSpace: "pre" }}
              fontFamily="Inter"
              fontSize="19.2381"
              fontWeight="600"
              letterSpacing="0px"
            >
              <tspan x="86.5713" y="50.0399">
                Logout
              </tspan>
            </text>
          </svg>
        </div>
        <button
          className={styles.logoutButton}
          aria-label="Logout"
          onClick={handleLogout}
        >
          <svg
            width="39"
            height="39"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 27.6249L34.125 19.4999M34.125 19.4999L26 11.3749M34.125 19.4999H14.625M19.5 27.6249C19.5 28.1052 19.5 28.3454 19.4821 28.5534C19.2966 30.7156 17.7041 32.4948 15.5757 32.918C15.3709 32.9587 15.132 32.9852 14.6548 33.0382L12.995 33.2227C10.5015 33.4997 9.25471 33.6383 8.2642 33.3213C6.94352 32.8987 5.8653 31.9336 5.29941 30.6677C4.875 29.7182 4.875 28.4638 4.875 25.9549V13.0449C4.875 10.536 4.875 9.28156 5.29942 8.33211C5.8653 7.06617 6.94352 6.10112 8.2642 5.67849C9.25472 5.36152 10.5015 5.50005 12.995 5.77711L14.6548 5.96154C15.1322 6.01458 15.3709 6.0411 15.5757 6.08182C17.7041 6.50502 19.2966 8.2842 19.4821 10.4464C19.5 10.6544 19.5 10.8946 19.5 11.3749"
              stroke="#F71414"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;