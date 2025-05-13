import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../config/api";
import "../styles/ReservationsPage.css";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  // Fetch restaurant details
  const fetchRestaurantDetails = async (restaurantId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/restaurants/${restaurantId}`
      );
      return {
        name: response.data.restaurant.name,
        address: `${response.data.restaurant.address}, ${response.data.restaurant.city}, ${response.data.restaurant.state} ${response.data.restaurant.zip}`,
      };
    } catch (err) {
      console.error(
        `Error fetching restaurant details for ID ${restaurantId}:`,
        err
      );
      return {
        name: `Restaurant #${restaurantId.substring(0, 6)}...`,
        address: "Address information unavailable",
      };
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      const token = sessionStorage.getItem("authToken");
      console.log("Fetching reservations with token:", token);
      try {
        if (!user || !token) {
          navigate("/login", { state: { from: "/reservations" } });
          return;
        }

        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/reservations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Raw API response:", response.data);

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected API response format");
        }

        // Format reservations
        const formattedReservations = [];
        const restaurantIds = new Set();
        const restaurantDetails = {};

        // Collect all unique restaurant IDs
        response.data.forEach((reservation) => {
          if (reservation.restaurantId) {
            restaurantIds.add(reservation.restaurantId);
          }
        });

        // Fetch restaurant details in parallel
        const restaurantPromises = Array.from(restaurantIds).map(async (id) => {
          const details = await fetchRestaurantDetails(id);
          restaurantDetails[id] = details;
        });

        await Promise.all(restaurantPromises);

        for (const reservation of response.data) {
          // Create a Date object from the dateTime string
          const utcDateTime = new Date(reservation.dateTime);

          // Pacific timezone
          const pacificDateTime = new Date(
            utcDateTime.toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
            })
          );

          const pacificDate = pacificDateTime.toLocaleDateString("en-CA");

          // Extract time as HH:MM
          const pacificTime = pacificDateTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          // Get restaurant details
          const restaurant = restaurantDetails[reservation.restaurantId] || {
            name: "Unknown Restaurant",
            address: "Address unknown",
          };

          formattedReservations.push({
            id: reservation.id,
            restaurantId: reservation.restaurantId,
            restaurantName: restaurant.name,
            restaurantAddress: restaurant.address,
            date: pacificDate,
            time: pacificTime,
            rawDateTime: reservation.dateTime,
            // Store the full date object for easier comparison
            fullDateTime: pacificDateTime,
            partySize: reservation.partySize,
            email: reservation.email,
            status: reservation.status,
          });
        }

        setReservations(formattedReservations);
        setError(null);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError(`Failed to load your reservations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate, isAuthenticated, user]);

  const cancelReservation = async (reservation) => {
    console.log("Canceling reservation with ID:", reservation);

    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        const token = sessionStorage.getItem("authToken");
        console.log("Canceling reservation with token:", token);

        if (token) {
          const response = await axios.put(
            `${BASE_URL}/api/restaurants/${reservation.restaurantId}/reservations/${reservation.id}`,
            {
              dateTime: reservation.rawDateTime,
              email: reservation.email,
              id: reservation.id,
              partySize: reservation.partySize,
              restaurantId: reservation.restaurantId,
              status: "CANCELLED",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Cancellation response:", response.data);

          setReservations((prev) =>
            prev.filter((res) => res.id !== reservation.id)
          );
        } else {
          alert("You must be logged in to cancel a reservation.");
          navigate("/login", { state: { from: "/reservations" } });
          return;
        }
      } catch (err) {
        console.error("Error canceling reservation:", err);
        alert("Failed to cancel reservation. Please try again.");
      }
    }
  };

  // Filter reservations based on active tab
  const filteredReservations = Array.isArray(reservations)
    ? reservations.filter((res) => {
      if(res.status === "CANCELLED") {
        return false;
      }
      // Get the current time in Pacific Time
        const nowUTC = new Date();
        const now = new Date(
          nowUTC.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
          })
        );

        if (res.fullDateTime) {
          if (activeTab === "upcoming") {
            return res.fullDateTime >= now;
          } else {
            return res.fullDateTime < now;
          }
        }

        // Fallback to comparing reconstructed date/time if fullDateTime is missing
        const reservationDate = new Date(`${res.date}T${res.time}`);

        console.log(
          `Comparing reservation (${reservationDate.toLocaleString()}) with now (${now.toLocaleString()})`
        );

        if (activeTab === "upcoming") {
          return reservationDate >= now;
        } else {
          return reservationDate < now;
        }
      })
    : [];

  // Format date for display
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const pacificDate = new Date(year, month - 1, day);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return pacificDate.toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    return timeString;
  };

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="reservations-page">
      <h1>My Reservations</h1>

      <div className="reservation-tabs">
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Reservations
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Reservations
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your reservations...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="empty-state">
          <p>
            {activeTab === "upcoming"
              ? "You don't have any upcoming reservations."
              : "You don't have any past reservations."}
          </p>
          <button onClick={() => navigate("/")}>Make a Reservation</button>
        </div>
      ) : (
        <div className="reservations-list">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div
                className="restaurant-info"
                title="Click to view restaurant details"
                onClick={() =>
                  navigate(`/restaurant/${reservation.restaurantId}`)
                }
              >
                <h2>{reservation.restaurantName}</h2>
                <p className="address">{reservation.restaurantAddress}</p>
              </div>

              <div className="reservation-details">
                <p className="date">
                  <strong>Date:</strong> {formatDate(reservation.date)}
                </p>
                <p className="time">
                  <strong>Time:</strong> {formatTime(reservation.time)}
                </p>
                <p className="party-size">
                  <strong>Party Size:</strong> {reservation.partySize} people
                </p>
              </div>

              {activeTab === "upcoming" && (
                <div className="reservation-actions">
                  {/* <button
                    className="modify-btn"
                    onClick={() =>
                      navigate(`/reservation/${reservation.id}/edit`)
                    }
                  >
                    Modify
                  </button> */}
                  <button
                    className="cancel-btn"
                    onClick={() => cancelReservation(reservation)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ReservationsPage;
