import React, { useEffect, useState } from "react";
import RestaurantBox from "../components/RestaurantBox";
import SearchComponent from "../components/SearchComponent";
import { getRestaurants } from "../utils/HomePageCalls";
import "../styles/HomePage.css";

const HomePage = () => {
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Check if topRatedRestaurants are already stored in sessionStorage
        const cachedRestaurants = sessionStorage.getItem("topRatedRestaurants");
        console.log("Cached Restaurants:", cachedRestaurants);
        if (cachedRestaurants) {
          // Parse the cached data and set it to state
          setTopRatedRestaurants(JSON.parse(cachedRestaurants));
        } else {
          // Fetch from API if not in sessionStorage
          const restaurants = await getRestaurants();
          if (restaurants && restaurants.length > 0) {
            // Sort by rating and take the top 5
            const sortedRestaurants = restaurants
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((restaurant) => ({
                ...restaurant,
                bookedTimes: restaurant.bookedTimes || [],
                timeSlots: restaurant.timeSlots || [],
              }));
            setTopRatedRestaurants(sortedRestaurants);

            // Store the sorted restaurants in sessionStorage for caching
            sessionStorage.setItem(
              "topRatedRestaurants",
              JSON.stringify(sortedRestaurants)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching top-rated restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <main className="homePage">
      <div className="reservation-container">
        <h1>Make a reservation</h1>
        <SearchComponent />
      </div>
      <div className="top-rated-restaurants">
        <h1>Top-Rated Restaurants</h1>
        <div className="restaurant-carousel">
          <button
            className="carousel-button left"
            onClick={() => {
              const list = document.querySelector(".restaurant-list");
              const itemWidth = 310 + 40; // 310px width + 40px gap
              if (list.scrollLeft === 0) {
                // If at the start, scroll to the end
                list.scrollTo({ left: list.scrollWidth, behavior: "smooth" });
              } else {
                // Scroll left by one item
                list.scrollBy({ left: -itemWidth, behavior: "smooth" });
              }
            }}
          >
            &#8249;
          </button>
          <div className="restaurant-list">
            {topRatedRestaurants.map((restaurant, index) => (
              <RestaurantBox
                key={index}
                name={restaurant.name}
                rating={restaurant.averageRating}
                reviews={restaurant.totalReviews}
                cuisine={restaurant.cuisine}
                bookedTimes={restaurant.bookedTimes}
                timeSlots={restaurant.timeSlots}
              />
            ))}
          </div>
          <button
            className="carousel-button right"
            onClick={() => {
              const list = document.querySelector(".restaurant-list");
              const itemWidth = 310 + 40; // 310px width + 40px gap
              if (list.scrollLeft + list.clientWidth >= list.scrollWidth) {
                // If at the end, scroll to the start
                list.scrollTo({ left: 0, behavior: "smooth" });
              } else {
                // Scroll right by one item
                list.scrollBy({ left: itemWidth, behavior: "smooth" });
              }
            }}
          >
            &#8250;
          </button>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
