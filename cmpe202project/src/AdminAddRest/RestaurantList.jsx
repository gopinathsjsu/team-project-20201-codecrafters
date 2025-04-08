import React from "react";
import styles from "../styles/ApproveNewRestaurant.module.css";

function RestaurantList({ restaurants, onSelectChange }) {
  return (
    <div className={styles.restaurantRows}>
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className={styles.restaurantRow}>
          <div>{restaurant.name}</div>
          <div>{restaurant.location}</div>
          <div>{restaurant.quantity}</div>
          <div
            className={`${styles.selectBox} ${restaurant.selected ? styles.selected : ""}`}
            onClick={() => onSelectChange(restaurant.id)}
            role="checkbox"
            aria-checked={restaurant.selected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectChange(restaurant.id);
              }
            }}
          >
            {restaurant.selected && (
              <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L5 8L2 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RestaurantList;
