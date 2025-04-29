import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RestaurantImage from "../assets/make-a-reservation-bg.png";
import SearchComponent from "../components/SearchComponent";
import { useNavigate } from "react-router-dom";
import TrendUp from "../assets/trend-up.svg";
import "../styles/RestaurantPage.css";
import TimeSlotsComponent from "../components/TimeSlotsComponent";
import {
  getRestaurantById,
  getRestaurantReviews,
  reviewRestaurant,
} from "../utils/apiCalls";
import HoursOfOperation from "../components/HoursOfOperation";
import { useAuth } from "../context/AuthContext";

const RestaurantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user } = useAuth();

  // Create state for restaurant data
  const [restaurantData, setRestaurantData] = useState({
    id: location.state?.id || "",
    name: location.state?.name || "",
    rating: location.state?.rating || 0,
    reviews: location.state?.reviews || [],
    cuisine: location.state?.cuisine || "",
    bookedTimes: location.state?.bookedTimes || 0,
    timeSlots: location.state?.timeSlots || [],
    description: location.state?.description || "",
    address: location.state?.address || "",
    city: location.state?.city || "",
    state: location.state?.state || "",
    zip: location.state?.zip || "",
    phone: location.state?.phone || "",
    email: location.state?.email || "",
    hours: location.state?.hours || {},
    imageUrls: location.state?.imageUrls || [],
  });

  useEffect(() => {
    console.log(restaurantData);
  }, [restaurantData]);

  useEffect(() => {
    if (location.state === null || !location.state.id) {
      const fetchRestaurant = async () => {
        const restaurantId = location.pathname.split("/").pop().trim();
        console.log("Fetching restaurant with ID:", restaurantId);
        const fetchedData = await getRestaurantById(restaurantId);
        if (fetchedData) {
          console.log("Fetched restaurant data:", fetchedData);
          // Update state with fetched data
          setRestaurantData({
            id: fetchedData.id || "",
            name: fetchedData.name || "",
            rating: fetchedData.averageRating || 0, // Map averageRating to rating
            reviews: fetchedData.totalReviews || [], // Map totalReviews to reviews
            cuisine: fetchedData.cuisine || "",
            bookedTimes: fetchedData.bookedTimes || 0, // Default if not available
            timeSlots: fetchedData.timeSlots || [], // Default if not available
            description: fetchedData.description || "",
            address: fetchedData.address || "",
            city: fetchedData.city || "",
            state: fetchedData.state || "",
            zip: fetchedData.zip || "",
            phone: fetchedData.phone || "",
            email: fetchedData.email || "",
            hours: fetchedData.hours || {},
            imageUrls: fetchedData.imageUrls || [],
          });
        } else {
          console.log("No restaurant data found for ID:", restaurantId);
          // Optionally redirect to 404 page
          // navigate("/not-found");
        }
      };
      fetchRestaurant();
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    // Fetch reviews when restaurantData.id changes
    const fetchReviews = async () => {
      if (restaurantData.id) {
        const reviewsData = await getRestaurantReviews(restaurantData.id);
        let averageRating = 0;
        reviewsData.forEach((review) => {
          averageRating += review.rating || 0;
        });
        averageRating /= reviewsData.length || 1;
        setRestaurantData((prevData) => ({
          ...prevData,
          reviews: reviewsData || [],
          rating: averageRating || 0,
        }));
        console.log("Fetched reviews data:", reviewsData);
      }
    };
    fetchReviews();
  }, [restaurantData.id]);

  // Rest of your component remains the same, but now uses the state variables
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (selectedRating === 0) {
      alert("Please select a rating before submitting your review.");
      return;
    }
    const response = await reviewRestaurant(restaurantData.id, {
      rating: selectedRating,
      comment: reviewText.trim(),
    });

    if (response) {
      alert("Review submitted successfully!");
      const updatedData = await getRestaurantReviews(restaurantData.id);
      console.log(
        "Updated restaurant data after review submission:",
        updatedData
      );
      let averageRating = 0;
      if (updatedData?.reviews?.length > 0) {
        averageRating =
          updatedData.reviews.reduce((sum, review) => sum + review.rating, 0) /
          updatedData.reviews.length;
      }
      setRestaurantData((prevData) => ({
        ...prevData,
        reviews: updatedData.reviews,
        rating: averageRating,
      }));
    }
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating); // Set the clicked rating
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating); // Set the hovered rating
  };

  const handleStarMouseLeave = () => {
    setHoveredRating(0); // Reset hovered rating when mouse leaves
  };

  return (
    <div className="restaurant-page">
      <div className="restaurant-image-container">
        <img src={RestaurantImage} alt="Restaurant" />
        <button className="see-all-photos-btn">See all photos</button>
      </div>
      {/* Restaurant info */}
      <div className="restaurant-info">
        <h1>{restaurantData.name}</h1>
        <div className="restaurant-details">
          <div className="rating-container">
            <div className="star-rating">
              <span className="rating-value">
                {Array.isArray(restaurantData.reviews) &&
                restaurantData.reviews.length > 0
                  ? restaurantData.rating.toFixed(1)
                  : ""}{" "}
              </span>
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className="star"
                  style={{
                    color:
                      index < Math.round(restaurantData.rating)
                        ? "#D33223"
                        : "#ccc",
                  }}
                >
                  {index < Math.round(restaurantData.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <div className="reviews">
              {Array.isArray(restaurantData.reviews) &&
              restaurantData.reviews.length > 0
                ? `${restaurantData.reviews.length} reviews`
                : "No reviews yet"}
            </div>
          </div>
          <p className="cuisine">{restaurantData.cuisine}</p>
          <div className="restaurant-address">
            <p>
              🗺️{" "}
              {`${restaurantData.address}, ${restaurantData.city}, ${restaurantData.state} ${restaurantData.zip}`}
            </p>
            <p>📞 {restaurantData.phone}</p>
            <p>✉️ {restaurantData.email}</p>
          </div>
        </div>
        <div className="description-and-reservation">
          <div className="description">
            {restaurantData.description || "No description available."}
          </div>
          <HoursOfOperation hours={restaurantData?.hours} />
          <div className="reservation">
            <h2>Make a Reservation</h2>
            <SearchComponent showSearch={false} />
            <div className="available-times">
              <h3>Select a time</h3>
              <TimeSlotsComponent
                timeSlots={restaurantData.timeSlots}
                name={restaurantData.name}
                id={restaurantData.id}
                address={`${restaurantData?.address}, ${restaurantData?.city}, ${restaurantData?.state} ${restaurantData?.zip}`}
              />
            </div>
            <div className="booked-times">
              <img src={TrendUp} alt="Trend Up" className="trend-icon" />
              Booked {restaurantData.bookedTimes} times today
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

          {Array.isArray(restaurantData.reviews) &&
          restaurantData.reviews.length > 0 ? (
            <>
              {restaurantData.reviews
                .slice(0, showAllReviews ? undefined : 3)
                .map((review, index) => (
                  <div key={review.id || index} className="review-item">
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="star"
                          style={{
                            color:
                              i < Math.round(review.rating)
                                ? "#D33223"
                                : "#ccc",
                          }}
                        >
                          {i < Math.round(review.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <div className="review-header">
                      <span className="reviewer-name">
                        {review.userName || "Anonymous"}
                      </span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-text">
                      {review.comment || review.text}
                    </p>
                  </div>
                ))}

              {restaurantData.reviews.length > 3 && (
                <button
                  className="show-all-reviews-btn"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews
                    ? "Show less"
                    : `Show all (${restaurantData.reviews.length})`}
                </button>
              )}
            </>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to leave a review!
            </p>
          )}
        </div>
      </div>
      {/* Leave a review */}
      <div className="leave-review-container">
        <h2>Leave a review</h2>
        {user ? (
          <form className="leave-review-form" onSubmit={handleSubmitReview}>
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    (hoveredRating || selectedRating) >= star
                      ? "filled"
                      : "empty"
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
              value={reviewText}
            ></textarea>
            <button className="submit-review-btn" type="submit">
              Submit Review
            </button>
          </form>
        ) : (
          <div className="login-to-review">
            <button
              className="login-btn"
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
            >
              Log in to review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
