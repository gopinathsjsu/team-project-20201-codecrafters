
import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css";
import { BASE_URL } from "../config/api";

function ReservationTable({ restaurantId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) throw new Error("Authorization token not found");
        if (!restaurantId) throw new Error("Restaurant ID is missing");

        const url = `${BASE_URL}/api/restaurants/${restaurantId}/reservations`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch reservations: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setReservations(data);
        console.log("✅ Reservation data:", data);
      } catch (err) {
        console.error("❌ Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [restaurantId]);

  const formatDateTime = (datetime) => {
    const options = { dateStyle: "medium", timeStyle: "short" };
    return new Date(datetime).toLocaleString(undefined, options);
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (reservations.length === 0) return <div style={{ color: "gray" }}>No reservations found.</div>;

  return (
    <article className={styles.topStore}>
      <h2 className={styles.reservationTitle}>Reservation Information</h2>

      {reservations.map((res, index) => (
        <div key={index} className={styles.reservationCard}>
          <h3 className={styles.reservationHeading}>Reservation #{index + 1}</h3>
          <div className={styles.row}>
            <strong>Email:</strong>
            <span>{res.email || "N/A"}</span>
          </div>
          <div className={styles.row}>
            <strong>Party Size:</strong>
            <span>{res.partySize || "N/A"}</span>
          </div>
          <div className={styles.row}>
            <strong>Reservation Time:</strong>
            <span>{formatDateTime(res.dateTime)}</span>
          </div>
          <div className={styles.row}>
            <strong>Restaurant ID:</strong>
            <span>{res.restaurantId || "N/A"}</span>
          </div>
        </div>
      ))}
    </article>
  );
}

export default ReservationTable;
