import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";
import SearchIcon from "../assets/searchIcon.svg";

const SearchComponent = ({
  horizontal = false,
  showSearch = true,
  onSearch,
}) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (reservationDate && reservationTime) return;
    const date = new Date();

    // Format the date as YYYY-MM-DD in the local timezone
    const localDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    // Format the time as HH:MM in the local timezone
    const localTime =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");

    setReservationDate(localDate);
    setReservationTime(localTime);
  }, []);

  const handleMakeReservation = (e) => {
    e.preventDefault();
    navigate("/search", {
      state: {
        reservationDate,
        reservationTime,
        numberOfGuests,
        searchTerm,
      },
    });
  };

  return (
    <form
      className={`reservation-form ${
        horizontal ? "reservation-form-horizontal" : ""
      }`}
      onSubmit={handleMakeReservation}
    >
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
      {showSearch && (
        <div className="search-and-submit">
          <img className="searchIcon" src={SearchIcon} alt="search icon" />
          <input
            type="text"
            placeholder="Search restaurant"
            className="reservation-input"
            value={searchTerm}
            maxLength={25}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="reservation-button"
            onClick={onSearch}
          >
            Search
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchComponent;
