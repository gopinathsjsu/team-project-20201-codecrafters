import React from "react";
import styles from "./SidebarNavItem.module.css";

function SidebarNavItem({ icon, text, isActive }) {
  return (
    <li className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
      <div className={styles.iconContainer}>{icon}</div>
      <span className={styles.navText}>{text}</span>
    </li>
  );
}

export default SidebarNavItem;
