import React from "react";
import styles from "../styles/Dashboard.module.css";
import DashboardHeader from "./DashboardHeader";
import ReservationTable from "./ReservationTable";

function DashboardContent() {
  return (
    <section className={styles.column2}>
      <div className={styles.div6}>
        <DashboardHeader />
        <ReservationTable />
      </div>
    </section>
  );
}

export default DashboardContent;
