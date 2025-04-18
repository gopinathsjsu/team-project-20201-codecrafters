import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import RestaurantImage from "../assets/make-a-reservation-bg.png";
import SearchComponent from "../components/SearchComponent";
import { useNavigate } from "react-router-dom";
import TrendUp from "../assets/trend-up.svg";
import "../styles/RestaurantPage.css";
import TimeSlotsComponent from "../components/TimeSlotsComponent";

const RestaurantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0); // Tracks the clicked rating
  const [hoveredRating, setHoveredRating] = useState(0); // Tracks the hovered rating

  const handleStarClick = (rating) => {
    setSelectedRating(rating); // Set the clicked rating
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating); // Set the hovered rating
  };

  const handleStarMouseLeave = () => {
    setHoveredRating(0); // Reset hovered rating when mouse leaves
  };
  const { name, rating, reviews, cuisine, bookedTimes, timeSlots } =
    location.state || {};

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log("Review submitted");
  };

  return (
    <div className="restaurant-page">
      <div className="restaurant-image-container">
        <img src={RestaurantImage} alt="Restaurant" />
        <button className="see-all-photos-btn">See all photos</button>
      </div>
      {/* Restaurant info */}
      <div className="restaurant-info">
        <h1>{name}</h1>
        <div className="restaurant-details">
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
          <p className="cuisine">{cuisine}</p>
        </div>
        <div className="description-and-reservation">
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>
          <div className="reservation">
            <h2>Make a Reservation</h2>
            <SearchComponent showSearch={false} />
            <div className="available-times">
              <h3>Select a time</h3>
              <TimeSlotsComponent timeSlots={timeSlots} name={name} />
            </div>
            <div className="booked-times">
              <img src={TrendUp} alt="Trend Up" className="trend-icon" />
              Booked {bookedTimes} times today
            </div>
          </div>
        </div>
      </div>
      {/* All Photos */}
      <div className="photos-container">
        <h2>23 Photos</h2>
        <div className="photos-grid">
          <div className="photo-thumbnail">
            <img src={RestaurantImage} alt="Photo 1" />
          </div>
          <div className="right-photos">
            <div className="photo-thumbnail">
              <img src={RestaurantImage} alt="Photo 2" />
            </div>
            <div className="photo-thumbnail">
              <img src={RestaurantImage} alt="Photo 3" />
              <button className="see-all-photos-btn">See all photos</button>
            </div>
          </div>
        </div>
      </div>
      {/* Reviews */}
      <div className="reviews-container">
        <h2>Reviews</h2>
        <div className="reviews-list">
          <h3>Latest reviews</h3>
          <div className="review-item">
            <div className="review-rating">
              <span className="star">&#9733;</span> {/* Star 1 */}
              <span className="star">&#9733;</span> {/* Star 2 */}
              <span className="star">&#9733;</span> {/* Star 3 */}
              <span className="star">&#9733;</span> {/* Star 4 */}
              <span className="star">&#9734;</span> {/* Star 5 (empty) */}
            </div>
            <div className="review-header">
              <span className="reviewer-name">John Doe</span>
              <span className="review-date">2 days ago</span>
            </div>
            <p className="review-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="review-item">
            <div className="review-rating">
              <span className="star">&#9733;</span> {/* Star 1 */}
              <span className="star">&#9733;</span> {/* Star 2 */}
              <span className="star">&#9733;</span> {/* Star 3 */}
              <span className="star">&#9733;</span> {/* Star 4 */}
              <span className="star">&#9734;</span> {/* Star 5 (empty) */}
            </div>
            <div className="review-header">
              <span className="reviewer-name">John Doe</span>
              <span className="review-date">2 days ago</span>
            </div>
            <p className="review-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="review-item">
            <div className="review-rating">
              <span className="star">&#9733;</span> {/* Star 1 */}
              <span className="star">&#9733;</span> {/* Star 2 */}
              <span className="star">&#9733;</span> {/* Star 3 */}
              <span className="star">&#9733;</span> {/* Star 4 */}
              <span className="star">&#9734;</span> {/* Star 5 (empty) */}
            </div>
            <div className="review-header">
              <span className="reviewer-name">John Doe</span>
              <span className="review-date">2 days ago</span>
            </div>
            <p className="review-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <button className="show-all-reviews-btn">Show all</button>
        </div>
      </div>
      {/* Leave a review */}
      <div className="leave-review-container">
        <h2>Leave a review</h2>
        <form className="leave-review-form" onSubmit={handleSubmitReview}>
          <div className="review-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  (hoveredRating || selectedRating) >= star ? "filled" : "empty"
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarMouseLeave}
              >
                &#9733;
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review here..."
            className="review-textarea"
          ></textarea>
          <button className="submit-review-btn" type="submit">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantPage;
