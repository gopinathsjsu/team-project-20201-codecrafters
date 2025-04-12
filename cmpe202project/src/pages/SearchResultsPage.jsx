import React, { useContext, useEffect } from "react";
import { ReservationContext } from "../context/ReservationContext";
import SearchComponent from "../components/SearchComponent";
import RestaurantBox from "../components/RestaurantBox";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const { reservationDate, reservationTime, numberOfGuests, searchTerm } =
    useContext(ReservationContext);

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
    <main className="search-container">
      <div className="search-component-container">
        <SearchComponent horizontal={true} />
      </div>
      <div className="search-results-container">
        <div className="filters-container">
          <ul className="filter-item">
            <li className="filter-type">Type of Cuisine</li>
            <label>
              <input type="checkbox" value="Italian" /> Italian
            </label>
            <label>
              <input type="checkbox" value="Chinese" /> Chinese
            </label>
            <label>
              <input type="checkbox" value="Indian" /> Indian
            </label>
            <label>
              <input type="checkbox" value="Mexican" /> Mexican
            </label>
            <label>
              <input type="checkbox" value="American" /> American
            </label>
          </ul>
          <div className="filter-item">
            <li className="filter-type">Price</li>
            <label>
              <input type="checkbox" value="$" /> $
            </label>
            <label>
              <input type="checkbox" value="$$" /> $$
            </label>
            <label>
              <input type="checkbox" value="$$$" /> $$$
            </label>
            <label>
              <input type="checkbox" value="$$$$" /> $$$$
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Rating</li>
            <label>
              <input type="checkbox" value="1" />
              <span>⭐</span>
            </label>
            <label>
              <input type="checkbox" value="2" />
              <span>⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="3" />
              <span>⭐⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="4" />
              <span>⭐⭐⭐⭐</span>
            </label>
            <label>
              <input type="checkbox" value="5" />
              <span>⭐⭐⭐⭐⭐</span>
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Location</li>
            <label>
              <input type="checkbox" value="New York" /> New York
            </label>
            <label>
              <input type="checkbox" value="San Francisco" /> San Francisco
            </label>
            <label>
              <input type="checkbox" value="Los Angeles" /> Los Angeles
            </label>
            <label>
              <input type="checkbox" value="Chicago" /> Chicago
            </label>
          </div>
        </div>
        <div className="results-container">
          <h2>{`Results for "${searchTerm}"`}</h2>
          <div className="restaurant-list">
            {getTopRatedRestaurants().map((restaurant, index) => (
              <RestaurantBox
                horizontal={true}
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
        </div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
