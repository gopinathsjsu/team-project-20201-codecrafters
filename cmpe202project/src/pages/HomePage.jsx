import React from "react";
import RestaurantBox from "../components/RestaurantBox";
import SearchComponent from "../components/SearchComponent";
import "../styles/HomePage.css";

const HomePage = () => {
  // Simulate fetching top-rated restaurants
  const getTopRatedRestaurants = () => {
    return [
      {
        name: "Fina Ristorante",
        rating: 4.5,
        reviews: 2100,
        cuisine: "Italian • Seafood • Mediterranean",
        bookedTimes: 15,
        timeSlots: ["6:30 PM", "7:00 PM", "8:00 PM"],
      },
      {
        name: "Sushi Palace",
        rating: 4.7,
        reviews: 2100,
        cuisine: "Japanese • Sushi",
        bookedTimes: 20,
        timeSlots: ["5:30 PM", "6:00 PM", "7:30 PM"],
      },
      {
        name: "Taco Haven",
        rating: 4.2,
        reviews: 2100,
        cuisine: "Mexican • Tacos",
        bookedTimes: 10,
        timeSlots: ["12:00 PM", "1:00 PM", "2:00 PM"],
      },
      {
        name: "Fina Ristorante",
        rating: 4.5,
        reviews: 2100,
        cuisine: "Italian • Seafood • Mediterranean",
        bookedTimes: 15,
        timeSlots: ["6:30 PM", "7:00 PM", "8:00 PM"],
      },
      {
        name: "Sushi Palace",
        rating: 4.7,
        reviews: 2100,
        cuisine: "Japanese • Sushi",
        bookedTimes: 20,
        timeSlots: ["5:30 PM", "6:00 PM", "7:30 PM"],
      },
      {
        name: "Taco Haven",
        rating: 4.2,
        reviews: 2100,
        cuisine: "Mexican • Tacos",
        bookedTimes: 10,
        timeSlots: ["12:00 PM", "1:00 PM", "2:00 PM"],
      },
      {
        name: "Fina Ristorante",
        rating: 4.5,
        reviews: 2100,
        cuisine: "Italian • Seafood • Mediterranean",
        bookedTimes: 15,
        timeSlots: ["6:30 PM", "7:00 PM", "8:00 PM"],
      },
      {
        name: "Sushi Palace",
        rating: 4.7,
        reviews: 2100,
        cuisine: "Japanese • Sushi",
        bookedTimes: 20,
        timeSlots: ["5:30 PM", "6:00 PM", "7:30 PM"],
      },
      {
        name: "Taco Haven",
        rating: 4.2,
        reviews: 2100,
        cuisine: "Mexican • Tacos",
        bookedTimes: 10,
        timeSlots: ["12:00 PM", "1:00 PM", "2:00 PM"],
      },
      {
        name: "Fina Ristorante",
        rating: 4.5,
        reviews: 2100,
        cuisine: "Italian • Seafood • Mediterranean",
        bookedTimes: 15,
        timeSlots: ["6:30 PM", "7:00 PM", "8:00 PM"],
      },
    ];
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
            {getTopRatedRestaurants().map((restaurant, index) => (
              <RestaurantBox
                key={index}
                name={restaurant.name}
                rating={restaurant.rating}
                reviews={restaurant.reviews}
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
