import React from "react";
import { useLocation } from "react-router-dom";

const RestaurantPage = () => {
  const location = useLocation();
  const { name, rating, reviews, cuisine, bookedTimes, timeSlots } =
    location.state || {};

  return (
    <div className="restaurant-page">
      <h1>{name}</h1>
      <p>Rating: {rating} ★</p>
      <p>{reviews} reviews</p>
      <p>Cuisine: {cuisine}</p>
      <p>Booked {bookedTimes} times today</p>
      <h3>Available Time Slots:</h3>
      {timeSlots && timeSlots.length > 0 ? (
        <ul>
          {timeSlots.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      ) : (
        <p>No available time slots</p>
      )}
    </div>
  );
};

export default RestaurantPage;
