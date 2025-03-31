import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import { use } from "react";

const HomePage = () => {
  const [today, setToday] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
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

    setToday(localDate);
    setCurrentTime(localTime);
  }, []);

  return (
    <main className="homePage">
      <div className="reservation-container">
        <h1>Make a reservation</h1>
        <form className="reservation-form">
          <div className="reservation-input-group">
            <input
              type="date"
              className="reservation-input"
              value={today}
              min={today}
            />
            <input
              type="time"
              className="reservation-input"
              value={currentTime}
              min={currentTime}
            />
            <input
              type="number"
              placeholder="Number of Guests"
              className="reservation-input"
              min="1"
            />
          </div>
          <div className="search-and-submit">
            <input
              type="text"
              placeholder="Search for a restaurant"
              className="reservation-input"
            />
            <button type="submit" className="reservation-button">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="top-rated-restaurants">
        <h1>Top-Rated Restaurants</h1>
        <div>container with restaurants</div>
      </div>
    </main>
  );
};

export default HomePage;
