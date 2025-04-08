import React from "react";
import styles from "../styles/Dashboard.module.css";

// Fake restaurant reservation data
const reservationData = [
  {
    id: 1,
    restaurantName: "The Italian Garden",
    address: "123 Main St, New York",
    customer: "John Smith",
    date: "July 15, 2024",
  },
  {
    id: 2,
    restaurantName: "Sushi Paradise",
    address: "456 Ocean Ave, Miami",
    customer: "Emma Johnson",
    date: "July 18, 2024",
  },
  {
    id: 3,
    restaurantName: "Taco Fiesta",
    address: "789 Sunset Blvd, LA",
    customer: "Michael Brown",
    date: "July 20, 2024",
  },
  {
    id: 4,
    restaurantName: "French Bistro",
    address: "321 Park Ave, Chicago",
    customer: "Sophia Williams",
    date: "July 22, 2024",
  },
];

function ReservationTable() {
  return (
    <article className={styles.topStore}>
      <div className={styles.div11}>
        {/* Table Header */}
        <div className={styles.div}>
          <div className={styles.column3}>
            <div className={styles.div12}>
              <h2 className={styles.reservation}>Reservation</h2>
              <p className={styles.restaurantname}>Restaurant name</p>
            </div>
          </div>
          <div className={styles.column4}>
            <h3 className={styles.address}>Address</h3>
          </div>
          <div className={styles.column5}>
            <div className={styles.div13}>
              <h3 className={styles.customer}>Customer</h3>
              <div className={styles.div14}>
                <button className={styles.share}>Share</button>
                <time className={styles.date}>Date</time>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Data Rows */}
        {reservationData.map((reservation) => (
          <div
            key={reservation.id}
            className={styles.div}
            style={{ marginTop: "20px" }}
          >
            <div className={styles.column3}>
              <div className={styles.div12}>
                <p
                  className={styles.restaurantname}
                  style={{ marginTop: "0", fontWeight: "normal" }}
                >
                  {reservation.restaurantName}
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
                {reservation.address}
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
                  {reservation.customer}
                </p>
                <div className={styles.div14}>
                  <time
                    style={{
                      alignSelf: "center",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    {reservation.date}
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
