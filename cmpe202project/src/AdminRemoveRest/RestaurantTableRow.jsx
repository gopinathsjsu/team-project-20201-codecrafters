import React from "react";
import styles from "../styles/RestaurantTableRow.module.css";

function RestaurantTableRow({ name, location, quantity, selected }) {
  return (
    <div className={styles.tableRow}>
      <div className={styles.restaurantName}>{name}</div>
      <div className={styles.location}>{location}</div>
      <div className={styles.quantity}>{quantity} Quantity</div>
      <div className={`${styles.selectBox} ${selected ? styles.selected : ""}`}>
        {selected && (
          <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none">
            <path
              d="M10 3L5 8L2 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        )}
      </div>
    </div>
  );
}

export default RestaurantTableRow;
