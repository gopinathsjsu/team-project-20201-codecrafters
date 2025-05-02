import React, { useEffect, useState, useRef } from "react";
import RestaurantBox from "../components/RestaurantBox";
import SearchComponent from "../components/SearchComponent";
import LoadingSpinner from "../components/LoadingSpinner";
import { getRestaurants, useApiCall } from "../utils/apiCalls";
import "../styles/HomePage.css";

const HomePage = () => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const restaurantListRef = useRef(null);

  // Use the API hook to fetch restaurants with loading state
  const { data: allRestaurants, isLoading, error } = useApiCall(getRestaurants);

  // Process and sort restaurants when the data changes
  useEffect(() => {
    if (allRestaurants && allRestaurants.length > 0) {
      // Process restaurants to ensure bookedTimes is a number
      const processedRestaurants = allRestaurants
        .filter((restaurant) => restaurant && restaurant.id) // Filter out invalid restaurants
        .map((restaurant) => ({
          ...restaurant,
          // Convert bookedTimes to a number if it's not already
          bookedTimes:
            typeof restaurant.bookedTimes === "number"
              ? restaurant.bookedTimes
              : 0,
          timeSlots: restaurant.timeSlots || [],
          // Ensure we have a valid rating
          averageRating: parseFloat(restaurant.averageRating || 0),
        }));

      // Sort first by rating, then by bookedTimes
      const sortedRestaurants = processedRestaurants
        .sort((a, b) => {
          // First sort by rating (descending)
          if (a.averageRating !== b.averageRating) {
            return b.averageRating - a.averageRating;
          }
          // If ratings are equal, sort by bookedTimes (descending)
          return b.bookedTimes - a.bookedTimes;
        })
        .slice(0, 10);

      setTopRatedRestaurants(sortedRestaurants);
      sessionStorage.setItem(
        "topRatedRestaurants",
        JSON.stringify(sortedRestaurants)
      );
    }
  }, [allRestaurants]);

  const scrollLeft = () => {
    const list = restaurantListRef.current;
    const itemWidth = 310 + 40; // 310px width + 40px gap
    if (list.scrollLeft === 0) {
      list.scrollTo({ left: list.scrollWidth, behavior: "smooth" });
    } else {
      list.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const list = restaurantListRef.current;
    const itemWidth = 310 + 40; // 310px width + 40px gap
    if (list.scrollLeft + list.clientWidth >= list.scrollWidth) {
      list.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      list.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  return (
    <main className="homePage">
      <div className="reservation-container">
        <h1>Make a reservation</h1>
        <SearchComponent />
      </div>
      <div className="top-rated-restaurants">
        <h1>Top-Rated Restaurants</h1>
        <div className="restaurant-carousel">
          {/* Show loading spinner while loading */}
          {isLoading && (
            <div className="loading-container">
              <LoadingSpinner size="large" text="Loading top restaurants..." />
            </div>
          )}

          {/* Show error message if there's an error */}
          {error && (
            <div className="error-message">
              <p>Error loading restaurants: {error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Show restaurants when loaded */}
          {!isLoading && !error && topRatedRestaurants.length > 0 && (
            <>
              <button className="carousel-button left" onClick={scrollLeft}>
                &#8249;
              </button>
              <div className="restaurant-list" ref={restaurantListRef}>
                {topRatedRestaurants.map((restaurant) => (
                  <RestaurantBox
                    key={
                      restaurant.id
                        ? `restaurant-${restaurant.id}`
                        : `restaurant-${Math.random()}`
                    }
                    {...restaurant}
                  />
                ))}
              </div>
              <button className="carousel-button right" onClick={scrollRight}>
                &#8250;
              </button>
            </>
          )}

          {/* Show empty state when no restaurants */}
          {!isLoading && !error && topRatedRestaurants.length === 0 && (
            <div className="no-results">
              <p>No restaurants found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
