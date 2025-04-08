"use client";
import React, { useState } from "react";
import styles from "../styles/RestaurantTable.module.css";
import RestaurantTableRow from "./RestaurantTableRow";

function RestaurantTable() {
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: "ArtisanWonders", location: "Washington,California", quantity: 102, selected: true },
    { id: 2, name: "SereneHarbor", location: "Washington,Georgia", quantity: 204, selected: true },
    { id: 3, name: "UrbanNest", location: "Franklin,Lowa", quantity: 304, selected: false },
    { id: 4, name: "VelvetBoutique", location: "Clinton,Indiana", quantity: 163, selected: false },
    { id: 5, name: "MystiKraft", location: "Centerville,Montana", quantity: 143, selected: false },
    { id: 6, name: "PoshPalette", location: "Washington,California", quantity: 170, selected: false },
    { id: 7, name: "VintageVista", location: "Greenville,Lowa", quantity: 160, selected: false },
  ]);

  const handleSelectChange = (id) => {
    const updated = restaurants.map((r) =>
      r.id === id ? { ...r, selected: !r.selected } : r
    );
    setRestaurants(updated);
  };

  const handleDelete = () => {
    const filtered = restaurants.filter((r) => !r.selected);
    setRestaurants(filtered);
  };

  return (
    <section className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Restaurants</h2>
        <button className={styles.deleteButton} onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className={styles.columnHeaders}>
        <div>Restaurant name</div>
        <div>Location</div>
        <div>Seat</div>
        <div>Select</div>
      </div>

      <div className={styles.tableBody}>
        {restaurants.map((restaurant) => (
          <RestaurantTableRow
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            location={restaurant.location}
            quantity={restaurant.quantity}
            selected={restaurant.selected}
            onSelectChange={handleSelectChange}
          />
        ))}
      </div>
    </section>
  );
}

export default RestaurantTable;
