import React, { useState, useEffect } from "react";
import styles from "../styles/Dashboard.module.css";

function ReservationTable() {
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
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <article className={styles.topStore}>
      <div className={styles.div11}>
        {/* Table Header */}
        <div className={styles.div}>
          <div className={styles.column3}>
            <div className={styles.div12}>
              <h2 className={styles.reservation}>Restaurants</h2>
              <p className={styles.restaurantname}>Restaurant name</p>
            </div>
          </div>
          <div className={styles.column4}>
            <h3 className={styles.address}>Address</h3>
          </div>
          <div className={styles.column5}>
            <div className={styles.div13}>
              <h3 className={styles.customer}>Cuisine Type</h3>
              <div className={styles.div14}>
                <button className={styles.share}>Share</button>
                <time className={styles.date}>Phone Number</time>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Data Rows */}
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={styles.div}
            style={{ marginTop: "20px" }}
          >
            <div className={styles.column3}>
              <div className={styles.div12}>
                <p
                  className={styles.restaurantname}
                  style={{ marginTop: "0", fontWeight: "normal" }}
                >
                  {restaurant.name}
                </p>
              </div>
            </div>
            <div className={styles.column4}>
              <p
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontFamily:
                    "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                  fontSize: "14px",
                  fontWeight: "normal",
                }}
              >
                {restaurant.address}
              </p>
            </div>
            <div className={styles.column5}>
              <div
                className={styles.div13}
                style={{ justifyContent: "space-between" }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    marginTop: "0",
                  }}
                >
                  {restaurant.cuisine || "N/A"}
                </p>
                <div className={styles.div14}>
                  <time
                    style={{
                      alignSelf: "center",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    {restaurant.phone || "N/A"}
                  </time>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ReservationTable;