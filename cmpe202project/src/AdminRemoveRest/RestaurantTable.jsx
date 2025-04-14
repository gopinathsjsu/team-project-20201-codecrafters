"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
      setError(null);
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
    const selectedIds = restaurants
      .filter((r) => r.selected)
      .map((r) => r.id);
    
    if (selectedIds.length === 0) {
      setError("Please select at least one restaurant to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} restaurant(s)?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authorization token not found");
      }

      await axios.delete(
        'http://humble-tenderness-production.up.railway.app/api/admin/restaurants',
        {
          data: selectedIds,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete restaurants");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (loading && restaurants.length === 0) {
    return <div className={styles.loading}>Loading restaurants...</div>;
  }

  return (
    <section className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Restaurants</h2>
        {restaurants.length > 0 && (
          <button 
            className={styles.deleteButton} 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>Error: {error}</span>
          <button onClick={clearError} className={styles.closeError}>×</button>
        </div>
      )}

      <div className={styles.columnHeaders}>
        <div>Restaurant name</div>
        <div>Address</div>
        <div>Select</div>
      </div>

      <div className={styles.tableBody}>
        {loading && restaurants.length > 0 ? (
          <div className={styles.loading}>Updating restaurants...</div>
        ) : restaurants.length > 0 ? (
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

