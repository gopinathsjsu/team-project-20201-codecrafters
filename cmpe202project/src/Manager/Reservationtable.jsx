import { useEffect, useState } from "react";
import { fetchReservations } from "../utils/fetchReservations";
import styles from "../styles/Dashboard.module.css";

function ReservationTable({ restaurantId }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setReservations([]);
      setLoading(false);
      return;
    }

    const loadReservations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        const data = await fetchReservations(token, restaurantId);
        console.log("Fetched reservations:", data);
        setReservations(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [restaurantId]);

  const formatDateTime = (datetime) => {
    const options = { dateStyle: "medium", timeStyle: "short" };
    return new Date(datetime).toLocaleString(undefined, options);
  };

  if (!restaurantId) return <div>Please select a restaurant.</div>;
  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (reservations.length === 0) return <div style={{ color: "gray" }}>No reservations found.</div>;

  return (
    <article className={styles.topStore} style={{ color: "black" }}>
      <h2 className={styles.reservationTitle}>Reservation Information</h2>

      {reservations.map((res, index) => (
        <div key={res.id} className={styles.reservationCard}>
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
            <span>{res.dateTime ? formatDateTime(res.dateTime) : "N/A"}</span>
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
