"use client";
import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import styles from "./Dashboard.module.css";

function RemoveRest() {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default RemoveRest;
