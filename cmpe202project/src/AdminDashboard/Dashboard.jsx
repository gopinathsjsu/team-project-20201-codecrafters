"use client";
import React from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";

function Dashboard() {
  return (
    <div className={styles.container}>
      <main className={styles.dashboard}>
        <div className={styles.div}>
          <Sidebar />
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
