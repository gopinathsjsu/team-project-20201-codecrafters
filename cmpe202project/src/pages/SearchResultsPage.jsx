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
      <div className="search-results-container">
        <div className="filters-container">
          <ul className="filter-item">
            <li className="filter-type">Type of Cuisine</li>
            <label>
              <input type="checkbox" value="Italian" /> Italian
            </label>
            <label>
              <input type="checkbox" value="Chinese" /> Chinese
            </label>
            <label>
              <input type="checkbox" value="Indian" /> Indian
            </label>
            <label>
              <input type="checkbox" value="Mexican" /> Mexican
            </label>
            <label>
              <input type="checkbox" value="American" /> American
            </label>
          </ul>
          <div className="filter-item">
            <li className="filter-type">Price</li>
            <label>
              <input type="checkbox" value="$" /> $
            </label>
            <label>
              <input type="checkbox" value="$$" /> $$
            </label>
            <label>
              <input type="checkbox" value="$$$" /> $$$
            </label>
            <label>
              <input type="checkbox" value="$$$$" /> $$$$
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Rating</li>
            <label>
              <input type="checkbox" value="1" />
              <span>⭐</span>
            </label>
            <label>
              <input type="checkbox" value="2" />
              <span>⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="3" />
              <span>⭐⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="4" />
              <span>⭐⭐⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="5" />
              <span>⭐⭐⭐⭐⭐</span>
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Location</li>
            <label>
              <input type="checkbox" value="New York" /> New York
            </label>
            <label>
              <input type="checkbox" value="San Francisco" /> San Francisco
            </label>
            <label>
              <input type="checkbox" value="Los Angeles" /> Los Angeles
            </label>
            <label>
              <input type="checkbox" value="Chicago" /> Chicago
            </label>
          </div>
        </div>
        <div className="results-container">Results</div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
