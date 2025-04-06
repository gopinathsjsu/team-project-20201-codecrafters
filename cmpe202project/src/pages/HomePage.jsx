import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import RestaurantBox from "../components/RestaurantBox";

const HomePage = () => {
  const [today, setToday] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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

  useEffect(() => {
    const date = new Date();

    // Format the date as YYYY-MM-DD in the local timezone
    const localDate =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    // Format the time as HH:MM in the local timezone
    const localTime =
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0");

    setToday(localDate);
    setCurrentTime(localTime);
  }, []);

  return (
    <main className="homePage">
      <div className="reservation-container">
        <h1>Make a reservation</h1>
        <form className="reservation-form">
          <div className="reservation-input-group">
            <input
              type="date"
              className="reservation-input"
              value={today}
              min={today}
            />
            <input
              type="time"
              className="reservation-input"
              value={currentTime}
              min={currentTime}
            />
            <input
              type="number"
              placeholder="Number of Guests"
              className="reservation-input"
              min="1"
            />
          </div>
          <div className="search-and-submit">
            <input
              type="text"
              placeholder="Search restaurant"
              className="reservation-input"
            />
            <button type="submit" className="reservation-button">
              Search
            </button>
          </div>
        </form>
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
