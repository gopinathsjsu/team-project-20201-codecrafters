import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
  const location = useLocation();
  const { reservationDate, reservationTime, numberOfGuests, searchTerm } =
    location.state || {};

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
      <div className="reservation-info"></div>
      <div className="search-results">
        <div className="filters"></div>
        <div className="results"></div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
