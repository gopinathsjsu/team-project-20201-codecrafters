"use client";
import React from "react";
import styles from "../styles/Dashboard.module.css";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";

function ManagerDashboard() {
  return (
    <div className={styles.container}>
      <main className={styles.dashboard}>
        <div className={styles.div}>
          <Sidebar activePath="/manager/dashboard" />
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

export default ManagerDashboard;
