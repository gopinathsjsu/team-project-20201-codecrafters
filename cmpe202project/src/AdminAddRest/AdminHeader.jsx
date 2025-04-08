import React from "react";
import styles from "../styles/ApproveNewRestaurant.module.css";
import AdminProfile from "./AdminProfile";

function AdminHeader({ title }) {
  return (
    <header className={styles.div7}>
      <h1 className={styles.dashboard2}>{title}</h1>
   
   
    </header>
  );
}

export default AdminHeader;
