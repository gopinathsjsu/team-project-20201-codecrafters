
"use client";
import React from "react";
import styles from "../styles/Dashboard.module.css";
import Sidebar from "../components/Sidebar";
import DashboardContent from "./DashboardContent";

function Dashboard() {
  // Corrected navigation items - removed the incorrect Restaurants->remove link
  const navItems = [
    { text: "Dashboard", path: "/admin/dashboard" },
    { text: "Restaurants", path: "/admin/restaurants" },
    { text: "Approve New Restaurant", path: "/admin/approve" }
  
  ];

  return (
    <div className={styles.container}>
      <main className={styles.dashboard}>
        <div className={styles.div}>
          <Sidebar 
            activePath="/admin/dashboard" // Correct active path for dashboard
            navItems={navItems}
            adminName="Admin"
          />
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;