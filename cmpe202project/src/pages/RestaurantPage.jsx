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
  deleteReview,
  updateReview,
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
  const [userReview, setUserReview] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    console.log("data: ", restaurantData);
  }, [restaurantData]);

  useEffect(() => {
    if (location.state === null || !location.state.id) {
      const fetchRestaurant = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const restaurantId = location.pathname.split("/").pop().trim();
          console.log("Fetching restaurant with ID:", restaurantId);

          // Validate restaurant ID
          if (!restaurantId) {
            throw new Error("Invalid restaurant ID");
          }

          const fetchedData = await getRestaurantById(restaurantId);
          console.log("Fetched data:", fetchedData);

          // Check if fetchedData contains an error property
          if (fetchedData.error) {
            throw new Error(
              fetchedData.message || "Failed to load restaurant details"
            );
          }

          // Check if we got valid restaurant data
          if (!fetchedData || !fetchedData.id) {
            throw new Error("Restaurant not found");
          }

          console.log("Fetched restaurant data:", fetchedData);

          // Update state with fetched data
          setRestaurantData({
            id: fetchedData.id || "",
            name: fetchedData.name || "",
            rating: fetchedData.averageRating || 0,
            reviews: fetchedData.totalReviews || [],
            cuisine: fetchedData.cuisine || "",
            bookedTimes: fetchedData.bookedTimes || 0,
            timeSlots: fetchedData.timeSlots || [],
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
        } catch (err) {
          navigate("/not-found");
        } finally {
          setIsLoading(false);
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
        console.log("raw reviews data:", reviewsData);

        // Calculate average rating correctly
        let totalRating = 0;
        reviewsData.forEach((review) => {
          totalRating += review.rating || 0;
        });
        const averageRating =
          reviewsData.length > 0 ? totalRating / reviewsData.length : 0;

        // Update restaurant data with reviews and calculated average
        setRestaurantData((prevData) => ({
          ...prevData,
          reviews: reviewsData || [],
          rating: averageRating,
        }));

        // Check if current user has already submitted a review
        if (user && user.email) {
          const existingReview = reviewsData.find(
            (review) => review.email === user.email
          );

          if (existingReview) {
            setUserReview(existingReview);
            setSelectedRating(existingReview.rating || 0);
            setReviewText(existingReview.comment || "");
            setIsEditingReview(true);
          } else {
            setUserReview(null);
            setSelectedRating(0);
            setReviewText("");
            setIsEditingReview(false);
          }
        }

        console.log("Fetched reviews data:", reviewsData);
      }
    };

    fetchReviews();
  }, [restaurantData.id, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
      alert("Please select a rating before submitting your review.");
      return;
    }

    try {
      let response;

      // Review data to send
      const reviewData = {
        rating: selectedRating,
        comment: reviewText.trim(),
      };

      if (isEditingReview && userReview && userReview.id) {
        // Update existing review
        response = await updateReview(
          restaurantData.id,
          userReview.id,
          reviewData
        );
      } else {
        // Create new review
        response = await reviewRestaurant(restaurantData.id, reviewData);
      }

      if (response) {
        // Fetch updated reviews
        const updatedReviews = await getRestaurantReviews(restaurantData.id);

        // Calculate new average
        let totalRating = 0;
        updatedReviews.forEach((review) => {
          totalRating += review.rating || 0;
        });
        const newAverageRating =
          updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

        // Update state with new data
        setRestaurantData((prevData) => ({
          ...prevData,
          reviews: updatedReviews,
          rating: newAverageRating,
        }));

        // Update user review status
        setUserReview({
          ...userReview,
          email: user.email,
          rating: selectedRating,
          comment: reviewText.trim(),
        });
        setIsEditingReview(true);

        alert(
          isEditingReview
            ? "Your review has been updated!"
            : "Review submitted successfully!"
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !userReview.id) {
      alert("Cannot delete review: Review ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your review?"
    );
    if (!confirmDelete) return;

    try {
      await deleteReview(restaurantData.id, userReview.id);

      // Fetch updated reviews after deletion
      const updatedReviews = await getRestaurantReviews(restaurantData.id);

      // Recalculate average rating
      let totalRating = 0;
      updatedReviews.forEach((review) => {
        totalRating += review.rating || 0;
      });
      const newAverageRating =
        updatedReviews.length > 0 ? totalRating / updatedReviews.length : 0;

      // Update state
      setRestaurantData((prevData) => ({
        ...prevData,
        reviews: updatedReviews,
        rating: newAverageRating,
      }));

      // Reset review form
      setUserReview(null);
      setSelectedRating(0);
      setReviewText("");
      setIsEditingReview(false);

      alert("Your review has been deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
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
        <img
          src={
            restaurantData?.imageUrls.length > 0
              ? restaurantData?.imageUrls[0]
              : RestaurantImage
          }
          alt="Restaurant"
        />
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
                hours={restaurantData.hours}
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
        <h2>
          {restaurantData?.imageUrls.length > 0
            ? `${restaurantData.imageUrls.length} `
            : ""}
          Photos
        </h2>
        <div className="photos-grid">
          <div className="photo-thumbnail">
            <img
              src={
                restaurantData?.imageUrls.length > 0
                  ? restaurantData?.imageUrls[0]
                  : RestaurantImage
              }
              alt="Photo 1"
            />
          </div>
          <div className="right-photos">
            <div className="photo-thumbnail">
              <img
                src={
                  restaurantData?.imageUrls.length > 0
                    ? restaurantData?.imageUrls[1]
                    : RestaurantImage
                }
                alt="Photo 2"
              />
            </div>
            <div className="photo-thumbnail">
              <img
                src={
                  restaurantData?.imageUrls[2]
                    ? restaurantData?.imageUrls[2]
                    : RestaurantImage
                }
                alt="Photo 3"
              />
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
        <h2>{isEditingReview ? "Update your review" : "Leave a review"}</h2>
        {user ? (
          <form className="leave-review-form" onSubmit={handleSubmitReview}>
            {isEditingReview && (
              <p className="editing-message">
                You've already reviewed this restaurant. You can update your
                review below.
              </p>
            )}
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
            <div className="review-buttons">
              <button className="submit-review-btn" type="submit">
                {isEditingReview ? "Update Review" : "Submit Review"}
              </button>
              {isEditingReview && (
                <button
                  className="delete-review-btn"
                  type="button"
                  onClick={handleDeleteReview}
                >
                  Delete Review
                </button>
              )}
            </div>
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
