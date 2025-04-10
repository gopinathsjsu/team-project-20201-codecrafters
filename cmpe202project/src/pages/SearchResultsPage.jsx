import React, { useContext, useEffect } from "react";
import { ReservationContext } from "../context/ReservationContext";
import SearchComponent from "../components/SearchComponent";

const SearchResultsPage = () => {
  const { reservationDate, reservationTime, numberOfGuests, searchTerm } =
    useContext(ReservationContext);

  useEffect(() => {
    console.log("Reservation Info:", {
      reservationDate,
      reservationTime,
      numberOfGuests,
      searchTerm,
    });
  }, [reservationDate, reservationTime, numberOfGuests, searchTerm]);

  return (
    <main className="search-container">
      <SearchComponent />
      <div className="reservation-info">
        <h2>Reservation Details</h2>
        <p>Date: {reservationDate || "Not provided"}</p>
        <p>Time: {reservationTime || "Not provided"}</p>
        <p>Guests: {numberOfGuests || "Not provided"}</p>
        <p>Search Term: {searchTerm || "Not provided"}</p>
      </div>
      <div className="search-results">
        <div className="filters"></div>
        <div className="results"></div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
