import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css";
import { BASE_URL } from "../config/api";

function ReservationTable() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/restaurants`);
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <article className={styles.topStore}>
      <div className={styles.div11}>
        <div className={styles.div}>
          <div className={styles.column3}><h2 className={styles.reservation}>Restaurants</h2></div>
          <div className={styles.column4}><h3 className={styles.address}>Address</h3></div>
          <div className={styles.column5}><h3 className={styles.customer}>Cuisine Type</h3></div>
        </div>
        {restaurants.map((r) => (
          <div key={r.id} className={styles.div} style={{ marginTop: "20px" }}>
            <div className={styles.column3}><p>{r.name}</p></div>
            <div className={styles.column4}><p>{r.address}</p></div>
            <div className={styles.column5}><p>{r.cuisine || "N/A"} — {r.phone || "N/A"}</p></div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ReservationTable;
