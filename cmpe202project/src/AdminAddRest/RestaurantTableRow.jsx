import React from "react";
import styles from "../styles/RestaurantTableRow.module.css";

function RestaurantTableRow({ id, name, location, quantity, selected, onSelectChange }) {
  const handleClick = () => {
    onSelectChange(id);
  };

  return (
    <div className={styles.tableRow}>
      <div className={styles.restaurantName}>{name}</div>
      <div className={styles.location}>{location}</div>
      <div
        className={`${styles.selectBox} ${selected ? styles.selected : ""}`}
        onClick={handleClick}
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick();
          }
        }}
      >
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
