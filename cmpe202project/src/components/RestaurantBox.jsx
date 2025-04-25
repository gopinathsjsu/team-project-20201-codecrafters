import React from "react";
import "../styles/RestaurantBox.css";
import RestaurantImage from "../assets/restaurant-example.png";
import TrendUp from "../assets/trend-up.svg";
import { useNavigate } from "react-router-dom";
import TimeSlotsComponent from "./TimeSlotsComponent";

const RestaurantBox = ({
  id,
  name,
  rating,
  reviews,
  cuisine,
  bookedTimes,
  timeSlots,
  horizontal = false,
  ...otherProps
}) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    // Only navigate if the click didn't start from a time-slot
    if (!event.target.closest(".time-slot")) {
      navigate(`/restaurant/${id}`, {
        state: {
          id,
          name,
          rating,
          reviews,
          cuisine,
          bookedTimes,
          timeSlots,
          ...otherProps,
        },
      });
    }
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
            <span className="rating-value">{reviews > 0 ? rating : ""} </span>
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
          <div className="reviews">
            {reviews > 0 ? `${reviews} reviews` : "No reviews yet"}
          </div>
        </div>
        <p className="restaurant-cuisine">{cuisine}</p>
        <div className="booked-times">
          <img src={TrendUp} alt="Trend Up" className="trend-icon" />
          Booked {bookedTimes} times today
        </div>
        <TimeSlotsComponent
          timeSlots={timeSlots}
          name={name}
          id={id}
          address={`${otherProps?.address}, ${otherProps?.city}, ${otherProps?.state} ${otherProps?.zip}`}
        />
      </div>
    </div>
  );
};

export default RestaurantBox;
