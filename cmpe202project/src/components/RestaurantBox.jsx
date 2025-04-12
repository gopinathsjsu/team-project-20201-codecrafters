import React from "react";
import "../styles/RestaurantBox.css";
import RestaurantImage from "../assets/restaurant-example.png";
import TrendUp from "../assets/trend-up.svg";

const RestaurantBox = ({
  name,
  rating,
  reviews,
  cuisine,
  bookedTimes,
  timeSlots,
  horizontal = false,
}) => {
  return (
    <div
      className={`restaurant-box ${
        horizontal ? "restaurant-box-horizontal" : "restaurant-box"
      }`}
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
            <span className="star">&#9733;</span> {/* Star 1 */}
            <span className="star">&#9733;</span> {/* Star 2 */}
            <span className="star">&#9733;</span> {/* Star 3 */}
            <span className="star">&#9733;</span> {/* Star 4 */}
            <span className="star">&#9734;</span> {/* Star 5 (empty) */}
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
        <div className="availability">
          {timeSlots && timeSlots.length > 0 ? (
            timeSlots.map((time, index) => (
              <span key={index} className="time-slot">
                {time}
              </span>
            ))
          ) : (
            <span className="no-availability">No slots available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantBox;
