"use client";
import React from "react";
import styles from "../styles/ApproveNewRestaurant.module.css";
import RestaurantList from "./RestaurantList";

function RestaurantTable() {
  // This could be fetched from an API in a real application
  const restaurants = [
    {
      name: "ArtisanWonders",
      location: "Washington,California",
      quantity: "102 Quantity",
    },
    {
      name: "SereneHarbor",
      location: "Washington,Georgia",
      quantity: "204 Quantity",
    },
    { name: "UrbanNest", location: "Franklin,Lowa", quantity: "304 Quantity" },
    {
      name: "VelvetBoutique",
      location: "Clinton,Indiana",
      quantity: "163 Quantity",
    },
    {
      name: "MystiKraft",
      location: "Centerville,Montana",
      quantity: "143 Quantity",
    },
    {
      name: "PoshPalette",
      location: "Washington,California",
      quantity: "170 Quantity",
    },
    {
      name: "VintageVista",
      location: "Greenville,Lowa",
      quantity: "160 Quantity",
    },
  ];

  const handleApprove = (restaurantName) => {
    console.log(`Approved: ${restaurantName}`);
    // Implementation would handle the approval logic
  };

  const handleDisapprove = (restaurantName) => {
    console.log(`Disapproved: ${restaurantName}`);
    // Implementation would handle the disapproval logic
  };

  return (
    <section className={styles.topStore}>
      <div className={styles.div11}>
        <div className={styles.div12}>
          <h2 className={styles.restaurant2}>Restaurant</h2>
          <div className={styles.div13}>
            <button
              className={styles.approve}
              onClick={() => handleApprove("all")}
            >
              Approve
            </button>
            <button
              className={styles.dispprove}
              onClick={() => handleDisapprove("all")}
            >
              Dispprove
            </button>
          </div>
        </div>

        <div className={styles.div14}>
          <div className={styles.restaurantname}>Restaurant name</div>
          <div className={styles.location}>Location</div>
          <div className={styles.seat}>Seat</div>
          <div className={styles.select}>Select</div>
        </div>

        <RestaurantList restaurants={restaurants} />
      </div>
    </section>
  );
}

export default RestaurantTable;
