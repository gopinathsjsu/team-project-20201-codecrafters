// SidebarNavItem.js
"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SidebarNavItem.module.css";

function SidebarNavItem({ icon, text, isActive, path }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <li
      className={`${styles.navItem} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.icon}>{icon}</div>
      <span className={styles.text}>{text}</span>
    </li>
  );
}

export default SidebarNavItem;
