"use client";
import React from "react";
import styles from "../styles/MainContent.module.css";
import RestaurantProfile from "./RestaurantProfile";

function MainContent() {
  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1 className={styles.title}>Manage Your Restaurant</h1>
        <div className={styles.profileContainer}>
          {/* Add manager name or logo here if needed */}
        </div>
      </header>

      <div className={styles.profileWrapper}>
        <RestaurantProfile />
      </div>
    </main>
  );
}

export default MainContent;
