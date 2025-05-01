import React, { useEffect, useState, useRef } from "react";
import RestaurantBox from "../components/RestaurantBox";
import SearchComponent from "../components/SearchComponent";
import { getRestaurants } from "../utils/apiCalls";
import "../styles/HomePage.css";

const HomePage = () => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const restaurantListRef = useRef(null); // Create a ref for the restaurant list

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const restaurants = await getRestaurants();

        if (restaurants && restaurants.length > 0) {
          // Process restaurants to ensure bookedTimes is a number
          const processedRestaurants = restaurants.map((restaurant) => ({
            ...restaurant,
            // Convert bookedTimes to a number if it's not already
            bookedTimes:
              typeof restaurant.bookedTimes === "number"
                ? restaurant.bookedTimes
                : 0,
            timeSlots: restaurant.timeSlots || [],
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
      } catch (error) {
        console.error("Error fetching top-rated restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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
          {isLoading && <p className="loading">Loading restaurants...</p>}

          {!isLoading && topRatedRestaurants.length > 0 && (
            <>
              <button className="carousel-button left" onClick={scrollLeft}>
                &#8249;
              </button>
              <div className="restaurant-list" ref={restaurantListRef}>
                {topRatedRestaurants.map((restaurant) => (
                  <RestaurantBox key={restaurant.id} {...restaurant} />
                ))}
              </div>
              <button className="carousel-button right" onClick={scrollRight}>
                &#8250;
              </button>
            </>
          )}

          {!isLoading && topRatedRestaurants.length === 0 && (
            <p className="no-results">No restaurants found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
