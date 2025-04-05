import React from "react";
import "../styles/RestaurantBox.css";
import RestaurantImage from "../assets/restaurant-example.png";

const RestaurantBox = () => {
  return (
    <div className="restaurant-box">
      <div className="image-container">
        <img
          src={RestaurantImage}
          alt="Restaurant"
          className="restaurant-image"
        />
      </div>
      <div className="restaurant-info">
        <h2 className="restaurant-name">Fina Ristorante</h2>
        <div className="rating-container">
          <div className="star-rating">
            <span className="star">&#9733;</span> {/* Star 1 */}
            <span className="star">&#9733;</span> {/* Star 2 */}
            <span className="star">&#9733;</span> {/* Star 3 */}
            <span className="star">&#9733;</span> {/* Star 4 */}
            <span className="star">&#9734;</span> {/* Star 5 (empty) */}
          </div>
          <div className="reviews">2,100 reviews</div>
        </div>
        <p className="restaurant-cuisine">Italian • Seafood • Mediterranean</p>
        <p className="booked-times">Booked 15 times today</p>
        <div className="availability">
          <span className="time-slot">6:30 PM</span>
          <span className="time-slot">7:00 PM</span>
          <span className="time-slot">8:00 PM</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBox;
