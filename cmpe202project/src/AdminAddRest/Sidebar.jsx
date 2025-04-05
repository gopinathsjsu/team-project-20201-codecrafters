"use client";
import React from "react";
import styles from "./Sidebar.module.css";
import SidebarNavItem from "./SidebarNavItem";

function Sidebar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.navContainer}>
        <ul className={styles.navList}>
          <SidebarNavItem

            text="Dashboard"
            isActive={false}
            path="/admin/dashboard"
          />
          <SidebarNavItem
      
            text="Restaurant"
            isActive={false}
            path="/admin/restaurants"
          />
          <SidebarNavItem

            text="Approve New Restaurant"
            isActive={true}
            path="/admin/approve"
          />
        </ul>
      </div>
      {/* your profileSection stays unchanged */}
    </nav>
  );
}

export default Sidebar;
