import React, { useContext, useEffect } from "react";
import { ReservationContext } from "../context/ReservationContext";
import SearchComponent from "../components/SearchComponent";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const { reservationDate, reservationTime, numberOfGuests, searchTerm } =
    useContext(ReservationContext);

  return (
    <main className="search-container">
      <div className="search-component-container">
        <SearchComponent horizontal={true} />
      </div>
      <div className="search-results">
        <div className="filters"></div>
        <div className="results"></div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
