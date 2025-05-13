import React, { useEffect, useState, useRef } from "react";
import RestaurantBox from "../components/RestaurantBox";
import SearchComponent from "../components/SearchComponent";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getRestaurants,
  useApiCall,
  getReservationsInRange,
} from "../utils/apiCalls";
import "../styles/HomePage.css";

const HomePage = () => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const restaurantListRef = useRef(null);

  // Use the API hook to fetch restaurants with loading state
  const { data: allRestaurants, isLoading, error } = useApiCall(getRestaurants);

  // Process and sort restaurants when the data changes
  useEffect(() => {
    const fetchData = async () => {
      if (allRestaurants && allRestaurants.length > 0) {
        const processedRestaurants = allRestaurants
          .filter((restaurant) => restaurant && restaurant.id)
          .map((restaurant) => ({
            ...restaurant,
            bookedTimes: 0, // Default
            averageRating: parseFloat(restaurant.averageRating || 0),
          }));

        // Get time range for today
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(now.setHours(24, 0, 0, 0)).toISOString();

        // Fetch today's reservations
        const reservationsToday = await getReservationsInRange(
          startOfDay,
          endOfDay
        );

        // Count bookedTimes per restaurant
        const bookedCountMap = {};
        reservationsToday.forEach((res) => {
          const resId = res.restaurantId;
          bookedCountMap[resId] = (bookedCountMap[resId] || 0) + 1;
        });

        const withBookings = processedRestaurants.map((rest) => ({
          ...rest,
          bookedTimes: bookedCountMap[rest.id] || 0,
        }));

        // Sort and save
        const sorted = withBookings
          .sort((a, b) =>
            b.averageRating !== a.averageRating
              ? b.averageRating - a.averageRating
              : b.bookedTimes - a.bookedTimes
          )
          .slice(0, 10);

        setTopRatedRestaurants(sorted);
        sessionStorage.setItem("topRatedRestaurants", JSON.stringify(sorted));
      }
    };

    fetchData();
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
