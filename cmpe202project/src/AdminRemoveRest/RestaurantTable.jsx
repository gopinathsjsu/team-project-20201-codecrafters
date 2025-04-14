"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/RestaurantTable.module.css";
import RestaurantTableRow from "./RestaurantTableRow";

function RestaurantTable() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://humble-tenderness-production.up.railway.app/api/restaurants"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      const data = await response.json();
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

  const handleSelectChange = (id) => {
    const updated = restaurants.map((r) =>
      r.id === id ? { ...r, selected: !r.selected } : r
    );
    setRestaurants(updated);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Get all selected restaurant IDs
      const selectedIds = restaurants
        .filter((r) => r.selected)
        .map((r) => r.id);
      
      // Delete each selected restaurant from the server
      const deletePromises = selectedIds.map(id =>
        fetch(`http://humble-tenderness-production.up.railway.app/api/admin/restaurants/${restaurant.id}`, {
          method: 'DELETE',
          // Add headers if your API requires authentication
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer your-token-here' // if needed
          }
        })
      );

      // Wait for all delete operations to complete
      const responses = await Promise.all(deletePromises);
      
      // Check if any deletion failed
      const failedDeletions = responses.some(response => !response.ok);
      if (failedDeletions) {
        throw new Error("Some deletions failed");
      }

      // Refresh the restaurant list after successful deletion
      await fetchRestaurants();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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