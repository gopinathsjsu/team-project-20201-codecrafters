import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";
import { BASE_URL } from "../config/api";

function ReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        
        if (!token) {
          throw new Error("Authorization token not found");
        }

        const response = await axios.get(
          `${BASE_URL}/api/admin/restaurants/reservations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setReservations(response.data);
      } catch (err) {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              setError("Session expired. Please log in again.");
              break;
            case 403:
              setError("You don't have permission to view reservations.");
              break;
            default:
              setError(`Server error: ${err.response.status}`);
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Calculate statistics
  const totalReservations = reservations.length;
  const cancelledReservations = reservations.filter(
    res => res.status === "CANCELLED"
  ).length;
  const completedReservations = reservations.filter(
    res => res.status === "COMPLETED"
  ).length;

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(
        `${BASE_URL}/api/admin/restaurants/reservations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReservations(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading reservation data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.topStore}>
      <div className={styles.headerRow}>
        <h2 style={{ color: "#000000" }}>Reservation Overview</h2>
        <button 
          className={styles.refreshButton}
          onClick={refreshData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className={styles.statsContainer} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className={styles.statCard}>
          <h3 style={{ color: "#000000" }}>Total Reservations</h3>
          <p className={styles.statNumber} style={{ color: "#000000" }}>
            {totalReservations}
          </p>
        </div>
        
        <div className={styles.statCard}>
          <h3 style={{ color: "#2196F3" }}>Completed</h3>
          <p className={styles.statNumber} style={{ color: "#2196F3" }}>
            {completedReservations}
          </p>
        </div>
        
        <div className={styles.statCard}>
          <h3 style={{ color: "#F44336" }}>Cancelled</h3>
          <p className={styles.statNumber} style={{ color: "#F44336" }}>
            {cancelledReservations}
          </p>
          {totalReservations > 0 && (
            <p className={styles.statSubtext}>
              ({((cancelledReservations / totalReservations) * 100).toFixed(1)}% cancellation rate)
            </p>
          )}
        </div>
      </div>
  
      <div className={styles.tableHeaderRow}>
        <h3 style={{ color: "#000000" }}>Recent Reservations</h3>
        <div className={styles.resultsCount}>
          Showing {Math.min(reservations.length, 10)} of {reservations.length} reservations
        </div>
      </div>
      
      <div className={styles.tableWrapper}>
        <div className={styles.reservationsTable} style={{ minWidth: '1000px' }}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell} style={{ width: '150px', color: "#000000", fontWeight: "600" }}>Restaurant</div>
            <div className={styles.tableCell} style={{ width: '180px', color: "#000000", fontWeight: "600" }}>Customer</div>
            <div className={styles.tableCell} style={{ width: '160px', color: "#000000", fontWeight: "600" }}>Date/Time</div>
            <div className={styles.tableCell} style={{ width: '90px', color: "#000000", fontWeight: "600" }}>Party Size</div>
            <div className={styles.tableCell} style={{ width: '110px', color: "#000000", fontWeight: "600" }}>Status</div>
            <div className={styles.tableCell} style={{ width: '130px', color: "#000000", fontWeight: "600" }}>Contact</div>
            <div className={styles.tableCell} style={{ width: '180px', color: "#000000", fontWeight: "600" }}>Special Requests</div>
          </div>
          
          {reservations.slice(0, 10).map(reservation => (
            <div key={reservation.id} className={styles.tableRow}>
              <div className={styles.tableCell} style={{ width: '150px' }}>
                <div className={styles.restaurantCell}>
                  {reservation.restaurant?.name || (
                    <span className={styles.restaurantId}>ID: {reservation.restaurantId}</span>
                  )}
                </div>
              </div>
              
              <div className={styles.tableCell} style={{ width: '180px', color: "#000000" }}>
                <div className={styles.customerCell}>
                  {reservation.customer?.name || 'Guest'}
                  {reservation.customerEmail && (
                    <div className={styles.customerEmail}>{reservation.customerEmail}</div>
                  )}
                </div>
              </div>
              
                
              <div className={styles.tableCell} style={{ width: '160px', color: "#000000" }}>
                <div className={styles.dateTimeCell}>
                  <div className={styles.datePart}>
                    {new Date(reservation.dateTime).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={styles.timePart}>
                    {new Date(reservation.dateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
                            
              <div className={styles.tableCell} style={{ width: '90px', color: "#000000" }}>
                {reservation.partySize}
              </div>
              
              <div className={styles.tableCell} style={{ width: '110px' }}>
                <span 
                  className={styles.statusBadge}
                  style={{
                    backgroundColor:
                      reservation.status === "CANCELLED" ? '#FFEBEE' :
                      reservation.status === "COMPLETED" ? '#E8F5E9' : '#F5F5F5',
                    color:
                      reservation.status === "CANCELLED" ? '#F44336' :
                      reservation.status === "COMPLETED" ? '#4CAF50' : '#9E9E9E'
                  }}
                >
                  {reservation.status}
                </span>
              </div>
              
              <div className={styles.tableCell} style={{ width: '130px', color: "#000000" }}>
                {reservation.phoneNumber || 'N/A'}
              </div>
              
              <div className={styles.tableCell} style={{ width: '180px', color: "#000000" }}>
                <div className={styles.specialRequests}>
                  {reservation.specialRequests || 'None'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


}

export default ReservationTable;