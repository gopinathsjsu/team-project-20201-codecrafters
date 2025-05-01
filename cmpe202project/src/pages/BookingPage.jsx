import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import "../styles/BookingPage.css";
import RestaurantImage from "../assets/restaurant-example.png";
import { confirmReservation } from "../utils/apiCalls";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const {
    reservationDate,
    reservationTime,
    numberOfGuests,
    setNumberOfGuests,
  } = useContext(ReservationContext);
  const location = useLocation();
  const { name, address, id } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (numberOfGuests === "") {
      setNumberOfGuests(1); // Default to 1 guest if not set
    }
  }, [numberOfGuests, setNumberOfGuests]);

  // For displaying the date in Pacific Time
  const [year, month, day] = reservationDate.split("-");

  // Create a date in Pacific Time zone
  const localDate = new Date(`${year}-${month}-${day}T12:00:00-07:00`); // -07:00 is Pacific Time offset
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });

  // Format the time in Pacific Time
  const formattedTime = new Date(
    `1970-01-01T${reservationTime}`
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      const [year, month, day] = reservationDate.split("-");
      const [hours, minutes] = reservationTime.split(":");

      const formattedHours = hours.padStart(2, "0");
      const formattedMinutes = minutes.padStart(2, "0");

      const formattedDateTime = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00`;

      console.log("Formatted DateTime for API:", formattedDateTime);

      const bookingRequest = {
        dateTime: formattedDateTime,
        partySize: parseInt(numberOfGuests, 10),
      };

      console.log("Sending booking request:", bookingRequest);

      const response = await confirmReservation(id, bookingRequest);
      console.log("Booking confirmed:", response);

      alert("Reservation confirmed successfully!");
      navigate("/reservations");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to confirm reservation. Please try again.");
    }
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
