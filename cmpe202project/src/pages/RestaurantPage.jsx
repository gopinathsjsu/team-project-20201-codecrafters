import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RestaurantImage from "../assets/make-a-reservation-bg.png";
import SearchComponent from "../components/SearchComponent";
import { useNavigate } from "react-router-dom";
import TrendUp from "../assets/trend-up.svg";
import "../styles/RestaurantPage.css";
import TimeSlotsComponent from "../components/TimeSlotsComponent";
import { getRestaurantById } from "../utils/apiCalls";
import { reviewRestaurant } from "../utils/apiCalls";

const RestaurantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0); // Tracks the clicked rating
  const [hoveredRating, setHoveredRating] = useState(0); // Tracks the hovered rating
  const [reviewText, setReviewText] = useState(""); // State for review text

  const handleStarClick = (rating) => {
    setSelectedRating(rating); // Set the clicked rating
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating); // Set the hovered rating
  };

  const handleStarMouseLeave = () => {
    setHoveredRating(0); // Reset hovered rating when mouse leaves
  };
  const { id, name, rating, reviews, cuisine, bookedTimes, timeSlots } =
    location.state || {};

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      alert("Please select a rating before submitting your review.");
      return; // Prevent submission if no rating is selected
    }
    const response = reviewRestaurant(id, {
      rating: selectedRating,
      comment: reviewText.trim(),
    });
    console.log("Review submitted:", response);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  useEffect(() => {
    if (location.state === null || !location.state.id) {
      const fetchRestaurant = async () => {
        const restaurantId = location.pathname.split("/").pop().trim();
        console.log("Fetching restaurant with ID:", restaurantId);
        const restaurantData = await getRestaurantById(restaurantId);
        if (restaurantData) {
          console.log("Fetched restaurant data:", restaurantData);
        } else {
          console.log("No restaurant data found for ID:", restaurantId);
        }
      };
      fetchRestaurant();
    }
  }, [location.state, navigate]);

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
            onChange={handleReviewTextChange}
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
