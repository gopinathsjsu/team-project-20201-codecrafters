"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "./MainContent";
import styles from "../styles/Dashboard.module.css";

function RemoveRest() {
  const navItems = [
    { text: "Dashboard", path: "/admin/dashboard" },
    { text: "Restaurants", path: "/admin/restaurants" },
    { text: "Approve New Restaurant", path: "/admin/approve" }
  ];

  return (
    <div className={styles.container}>
      <Sidebar 
        activePath="/admin/restaurants"
        navItems={navItems}
        adminName="Admin"
      />
      <MainContent>
        <div className={styles.removeContainer}>
          <h1>Remove Restaurant</h1>
          <div className={styles.removeForm}>
            <p>Select restaurant to remove:</p>
            {/* Removal interface components */}
          </div>
        </div>
      </MainContent>
    </div>
  );
}

export default RemoveRest;