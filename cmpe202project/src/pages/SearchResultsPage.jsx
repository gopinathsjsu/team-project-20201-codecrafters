import React, { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import SearchComponent from "../components/SearchComponent";
import RestaurantBox from "../components/RestaurantBox";
import { getRestaurants } from "../utils/apiCalls";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const { numberOfGuests, searchTerm, setNumberOfGuests } =
    useContext(ReservationContext);
  const [restaurants, setRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  const getRestaurantsData = async () => {
    const allRestaurants = await getRestaurants();

    // Sort restaurants based on whether they match the searchTerm
    const sortedRestaurants = allRestaurants.sort((a, b) => {
      const aMatches =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      const bMatches =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

      // Prioritize matches (true > false)
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;

      // If both match or neither match, maintain original order
      return 0;
    });

    setRestaurants(sortedRestaurants);
  };

  useEffect(() => {
    if (restaurants.length > 0) {
      const cuisines = new Set();
      const locations = new Set();

      restaurants.forEach((restaurant) => {
        cuisines.add(restaurant.cuisine);
        locations.add(restaurant.city);
      });

      setAllCuisines(Array.from(cuisines)); // Convert Set to Array
      setAllLocations(Array.from(locations)); // Convert Set to Array
    }
  }, [restaurants]);

  const handleSearchClick = () => {
    getRestaurantsData(); // Fetch and filter restaurants when the search button is clicked
  };

  useEffect(() => {
    if (numberOfGuests === "") {
      setNumberOfGuests(1);
    }
    getRestaurantsData();
  }, [numberOfGuests, setNumberOfGuests]);

  return (
    <main className="search-container">
      <div className="search-component-container">
        {/* Pass the handleSearchClick function to SearchComponent */}
        <SearchComponent horizontal={true} onSearch={handleSearchClick} />
      </div>
      <div className="search-results-container">
        <div className="filters-container">
          <ul className="filter-item">
            <li className="filter-type">Type of Cuisine</li>
            {allCuisines?.map((cuisine, index) => (
              <label key={index}>
                <input type="checkbox" value={cuisine} /> {cuisine}
              </label>
            ))}
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
            {allLocations?.map((location, index) => (
              <label key={index}>
                <input type="checkbox" value={location} /> {location}
              </label>
            ))}
          </div>
        </div>
        <div className="results-container">
          {searchTerm && <h2>{`Results for "${searchTerm}"`}</h2>}
          <div className="restaurant-list">
            {restaurants.map((restaurant, index) => (
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
