"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/RestaurantTable.module.css";
import RestaurantTableRow from "./RestaurantTableRow";

function RestaurantTable() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          "http://humble-tenderness-production.up.railway.app/api/restaurants"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();
        // Transform API data to match your expected structure
        const formattedData = data.map((restaurant, index) => ({
          id: restaurant.id || index + 1,
          name: restaurant.name || "Unnamed Restaurant",
          location: restaurant.address || "Location not specified",
          phone: restaurant.phone || "No phone provided",
          selected: false,
        }));
        setRestaurants(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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

  if (loading) {
    return <div className={styles.loading}>Loading restaurants...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <section className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Restaurants</h2>
        {restaurants.length > 0 && (
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>

      <div className={styles.columnHeaders}>
        <div>Restaurant name</div>
        <div>Address</div>
        <div>Select</div>
      </div>

      <div className={styles.tableBody}>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantTableRow
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              location={restaurant.location}
              phone={restaurant.phone}
              selected={restaurant.selected}
              onSelectChange={handleSelectChange}
            />
          ))
        ) : (
          <div className={styles.noResults}>No restaurants found</div>
        )}
      </div>
    </section>
  );
}

export default RestaurantTable;