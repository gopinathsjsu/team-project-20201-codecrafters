"use client";
import React from "react";
import styles from "../styles/MainContent.module.css";
import RestaurantTable from "./RestaurantTable";


function MainContent() {
  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1 className={styles.title}>Restaurants</h1>
        <div className={styles.profileContainer}>
         

        </div>
      </header>

      <RestaurantTable />
    </main>
  );
}

export default MainContent;
