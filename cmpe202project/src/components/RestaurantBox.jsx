import React, { useState, useEffect } from "react";
import "../styles/RestaurantBox.css";
import RestaurantImage from "../assets/restaurant-example.png";
import TrendUp from "../assets/trend-up.svg";
import { useNavigate } from "react-router-dom";
import TimeSlotsComponent from "./TimeSlotsComponent";
import { getRestaurantReviews } from "../utils/apiCalls";

const RestaurantBox = ({
  id,
  name,
  rating: initialRating,
  cuisine,
  bookedTimes,
  timeSlots,
  horizontal = false,
  ...otherProps
}) => {
  const navigate = useNavigate();
  const [reviewsData, setReviewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calculatedRating, setCalculatedRating] = useState(initialRating);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await getRestaurantReviews(id);
        if (response && Array.isArray(response)) {
          setReviewsData(response);

          // Calculate average rating from reviews if available
          if (response.length > 0) {
            const avgRating =
              response.reduce((sum, review) => sum + review.rating, 0) /
              response.length;
            setCalculatedRating(avgRating);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
    console.log(bookedTimes);
  }, [id, initialRating]);

  const handleClick = (event) => {
    // Only navigate if the click didn't start from a time-slot
    if (!event.target.closest(".time-slot")) {
      navigate(`/restaurant/${id}`, {
        state: {
          id,
          name,
          rating: calculatedRating,
          reviews: reviewsData,
          cuisine,
          bookedTimes,
          timeSlots,
          ...otherProps,
        },
      });
    }
  };

  // Use reviewsData length for review count
  const reviewCount = reviewsData.length;

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
            <span className="rating-value">
              {reviewCount > 0 ? calculatedRating.toFixed(1) : ""}{" "}
            </span>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className="star"
                style={{
                  color:
                    index < Math.round(calculatedRating) ? "#D33223" : "#ccc",
                }}
              >
                {index < Math.round(calculatedRating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <div className="reviews">
            {isLoading
              ? "Loading reviews..."
              : reviewCount > 0
              ? `${reviewCount} reviews`
              : "No reviews yet"}
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
