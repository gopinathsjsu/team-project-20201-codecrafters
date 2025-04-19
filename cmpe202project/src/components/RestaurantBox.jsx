import React from "react";
import "../styles/RestaurantBox.css";
import RestaurantImage from "../assets/restaurant-example.png";
import TrendUp from "../assets/trend-up.svg";
import { useNavigate } from "react-router-dom";
import TimeSlotsComponent from "./TimeSlotsComponent";

const RestaurantBox = ({
  name,
  rating,
  reviews,
  cuisine,
  bookedTimes,
  timeSlots,
  horizontal = false,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/restaurant/${name}`, {
      state: {
        name,
        rating,
        reviews,
        cuisine,
        bookedTimes,
        timeSlots,
      },
    });
  };

  return (
    <div
      className={`restaurant-box ${
        horizontal ? "restaurant-box-horizontal" : "restaurant-box"
      }`}
      onClick={handleClick}
    >
      <div className="image-container">
        <img
          src={RestaurantImage}
          alt="Restaurant"
          className="restaurant-image"
        />
      </div>
      <div className="restaurant-info">
        <h2 className="restaurant-name">{name}</h2>
        <div className="rating-container">
          <div className="star-rating">
            <span className="rating-value">{rating} </span>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="star"
                style={{
                  color: index < Math.floor(rating) ? "#D33223" : "#ccc",
                }}
              >
                {index < Math.floor(rating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <div className="reviews">{reviews} reviews</div>
        </div>
        <p className="restaurant-cuisine">{cuisine}</p>
        <div className="booked-times">
          <img src={TrendUp} alt="Trend Up" className="trend-icon" />
          Booked {bookedTimes} times today
        </div>
        {timeSlots && timeSlots.length > 0 ? (
          <span className="availability-text">Available Time Slots:</span>
        ) : (
          <span className="availability-text">No available time slots</span>
        )}
        <TimeSlotsComponent timeSlots={timeSlots} name={name} />
      </div>
    </div>
  );
};

export default RestaurantBox;
