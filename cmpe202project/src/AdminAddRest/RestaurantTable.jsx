"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/RestaurantTable.module.css";
import RestaurantTableRow from "./RestaurantTableRow";
import { BASE_URL } from "../config/api";

function RestaurantApprovalTable() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUnapprovedRestaurants();
  }, []);

  const fetchUnapprovedRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin/restaurants`,
        {
          params: { unapprovedOnly: true },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedData = response.data.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name || "Unnamed Restaurant",
        location: restaurant.address || "Location not specified",
        capacity: restaurant.capacity || 0,
        selected: false,
      }));
      
      setRestaurants(formattedData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch restaurants");
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

  const handleApproval = async (shouldApprove) => {
    const selectedIds = restaurants.filter((r) => r.selected).map((r) => r.id);

    if (selectedIds.length === 0) {
      setError(`Please select at least one restaurant to ${shouldApprove ? "approve" : "reject"}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authorization token not found");
      }

      await axios.post(
        `${BASE_URL}/api/admin/restaurants/approve?approved=${shouldApprove}`,
        { restaurantIds: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchUnapprovedRestaurants();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        `Failed to ${shouldApprove ? "approve" : "reject"} restaurants`
      );
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
        <h2 className={styles.tableTitle}>Restaurant Approvals</h2>
        {restaurants.length > 0 && (
          <div className={styles.buttonContainer}>
            <button
              className={styles.approveButton}
              onClick={() => handleApproval(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Approve"}
            </button>
            <button
              className={styles.disapproveButton}
              onClick={() => handleApproval(false)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Disapprove"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>Error: {error}</span>
          <button onClick={clearError} className={styles.closeError}>
            ×
          </button>
        </div>
      )}

      <div className={styles.columnHeaders}>
        <div>Restaurant Name</div>
        <div>Address</div>
        <div>Select</div>
      </div>

      <div className={styles.tableBody}>
        {loading && restaurants.length > 0 ? (
          <div className={styles.loading}>Updating list...</div>
        ) : restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantTableRow
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              location={restaurant.location}
              quantity={restaurant.capacity}
              selected={restaurant.selected}
              onSelectChange={handleSelectChange}
            />
          ))
        ) : (
          <div className={styles.noResults}>No restaurants requiring approval</div>
        )}
      </div>
    </section>
  );
}

export default RestaurantApprovalTable;