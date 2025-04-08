import React from "react";
import styles from "../styles/Dashboard.module.css";
import UserProfile from "./UserProfile";

function DashboardHeader() {
  return (
    <header className={styles.div7}>
      <div className={styles.dashboard3}>
        <h1 className={styles.dashboard4}>Dashboard</h1>
        <time className={styles.june2024}>29 June 2024</time>
      </div>
    
    </header>
  );
}

export default DashboardHeader;
