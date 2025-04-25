import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import "../styles/BookingPage.css";
import RestaurantImage from "../assets/restaurant-example.png";
import { confirmReservation } from "../utils/apiCalls";

const BookingPage = () => {
  const {
    reservationDate,
    reservationTime,
    numberOfGuests,
    setNumberOfGuests,
  } = useContext(ReservationContext);
  const location = useLocation();
  const { name, address, id } = location.state || {};

  useEffect(() => {
    if (numberOfGuests === "") {
      setNumberOfGuests(1); // Default to 1 guest if not set
    }
  }, [numberOfGuests, setNumberOfGuests]);

  // Format the date as "Month Day, Year"
  const formattedDate = new Date(reservationDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Format the time as "hh:mm AM/PM"
  const formattedTime = new Date(
    `1970-01-01T${reservationTime}`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    let combinedDateTime = new Date(`${reservationDate}T${reservationTime}`);

    // Format the request according to the required structure
    let bookingRequest = {
      dateTime: combinedDateTime.toISOString(),
      partySize: parseInt(numberOfGuests, 10),
    };

    const response = confirmReservation(id, bookingRequest);
    console.log("Booking confirmed:", response);
  };

  return (
    <form className="booking-page" onSubmit={handleBookingSubmit}>
      <h1>Booking Confirmation</h1>
      <div className="booking-details">
        <div className="restaurant-img-container">
          <img src={RestaurantImage} alt="Restaurant" />
        </div>
        <div className="details-container">
          <h2>{name}</h2>
          <div className="date-container">
            <span className="icon">&#128197;</span> {/* Unicode for calendar */}
            <span>{formattedDate}</span>
          </div>
          <div className="time-guests-container">
            <div className="time-container">
              <span className="icon">&#128337;</span> {/* Unicode for clock */}
              <span>{formattedTime}</span>
            </div>
            <div className="guests-container">
              <span className="icon">&#128101;</span> {/* Unicode for people */}
              <span>{numberOfGuests} people</span>
            </div>
          </div>
          <div>{`🗺️${address}`}</div>
        </div>
      </div>
      <div className="email-phone-container">
        <div className="email-container">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="phone-container">
          <label htmlFor="phone">Phone number: (optional)</label>
          <input type="tel" id="phone" placeholder="Enter your phone number" />
        </div>
      </div>
      <button className="confirm-booking-btn">Confirm Reservation</button>
    </form>
  );
};

export default BookingPage;
