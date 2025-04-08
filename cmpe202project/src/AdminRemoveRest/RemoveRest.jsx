"use client";
import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import styles from "../styles/Dashboard.module.css";

function RemoveRest() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default RemoveRest;
