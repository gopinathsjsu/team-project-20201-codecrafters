"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "./MainContent";
import styles from "../styles/Dashboard.module.css";

function ApproveNewRestaurant() {
  // Corrected navigation items - removed the incorrect Restaurants->remove link
  const navItems = [
    { text: "Dashboard", path: "/admin/dashboard" },
    { text: "Restaurants", path: "/admin/restaurants" },
  
    { text: "Approve New Restaurant", path: "/admin/approve" }
  ];
    

  return (
    <div className={styles.container}>
      <Sidebar 
        activePath="/admin/approve" // Correctly highlights the approve item
        navItems={navItems}
        adminName="Admin"
      />
      <MainContent>
        {/* Your approval content goes here */}
        <h1>Approve New Restaurant</h1>
        {/* Add your approval form components here */}
      </MainContent>
    </div>
  );
}

export default ApproveNewRestaurant;