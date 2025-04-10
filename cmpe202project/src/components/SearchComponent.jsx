import React, { useContext } from "react";
import { ReservationContext } from "../context/ReservationContext";

const SearchComponent = ({ handleMakeReservation }) => {
  const {
    reservationDate,
    setReservationDate,
    reservationTime,
    setReservationTime,
    numberOfGuests,
    setNumberOfGuests,
    searchTerm,
    setSearchTerm,
  } = useContext(ReservationContext);

  return (
    <form className="reservation-form" onSubmit={handleMakeReservation}>
      <div className="reservation-input-group">
        <input
          type="date"
          className="reservation-input"
          value={reservationDate}
          min={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
        />
        <input
          type="time"
          className="reservation-input"
          value={reservationTime}
          min={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Guests"
          className="reservation-input"
          value={numberOfGuests}
          min="1"
          onChange={(e) => setNumberOfGuests(e.target.value)}
        />
      </div>
      <div className="search-and-submit">
        <input
          type="text"
          placeholder="Search restaurant"
          className="reservation-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="reservation-button">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchComponent;
