"use client";
import React from "react";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import styles from "../styles/MainContent.module.css";

function ManagerDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
        </header>
        <div className={styles.profileWrapper}>
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;
