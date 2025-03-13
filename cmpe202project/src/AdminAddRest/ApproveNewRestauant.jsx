"use client";
import React from "react";
import styles from "./ApproveNewRestaurant.module.css";
import Sidebar from "./Sidebar";
import RestaurantTable from "./RestaurantTable";
import AdminHeader from "./AdminHeader";

function ApproveNewRestaurant() {
  return (
    <main className={styles.approvenewrestaurant}>
      <div className={styles.div}>
        <div className={styles.column}>
          <Sidebar />
        </div>
        <div className={styles.column2}>
          <section className={styles.div6}>
            <AdminHeader title="Approve New Restaurant" />
            <RestaurantTable />
          </section>
        </div>
      </div>
    </main>
  );
}

export default ApproveNewRestaurant;
