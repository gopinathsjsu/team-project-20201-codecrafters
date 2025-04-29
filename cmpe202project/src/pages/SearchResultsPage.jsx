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
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  // Filter states
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Fetch restaurants data and sort based on search term
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

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    setRestaurants(sortedRestaurants);
    setFilteredRestaurants(sortedRestaurants); // Initialize filtered with all restaurants
  };

  // Apply all filters to restaurants
  const applyFilters = () => {
    let filtered = [...restaurants];

    // Filter by cuisine
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter((restaurant) =>
        selectedCuisines.includes(restaurant.cuisine)
      );
    }

    // Filter by price range
    if (selectedPrices.length > 0) {
      filtered = filtered.filter((restaurant) =>
        selectedPrices.includes(restaurant.priceRange)
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((restaurant) => {
        // Get the lowest selected rating as the threshold
        const minRating = Math.min(...selectedRatings.map(Number));
        return restaurant.averageRating >= minRating;
      });
    }

    // Filter by location
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((restaurant) =>
        selectedLocations.includes(restaurant.city)
      );
    }

    setFilteredRestaurants(filtered);
  };

  // Handle checkbox changes for cuisine filter
  const handleCuisineChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCuisines([...selectedCuisines, value]);
    } else {
      setSelectedCuisines(
        selectedCuisines.filter((cuisine) => cuisine !== value)
      );
    }
  };

  // Handle checkbox changes for price filter
  const handlePriceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedPrices([...selectedPrices, value]);
    } else {
      setSelectedPrices(selectedPrices.filter((price) => price !== value));
    }
  };

  // Handle checkbox changes for rating filter
  const handleRatingChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRatings([...selectedRatings, value]);
    } else {
      setSelectedRatings(selectedRatings.filter((rating) => rating !== value));
    }
  };

  // Handle checkbox changes for location filter
  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedLocations([...selectedLocations, value]);
    } else {
      setSelectedLocations(
        selectedLocations.filter((location) => location !== value)
      );
    }
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    if (restaurants.length > 0) {
      applyFilters();
    }
  }, [selectedCuisines, selectedPrices, selectedRatings, selectedLocations]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const cuisines = new Set();
      const locations = new Set();

      restaurants.forEach((restaurant) => {
        cuisines.add(restaurant.cuisine);
        locations.add(restaurant.city);
      });

      setAllCuisines(Array.from(cuisines));
      setAllLocations(Array.from(locations));
    }
  }, [restaurants]);

  useEffect(() => {
    if (numberOfGuests === "") {
      setNumberOfGuests(1);
    }
    getRestaurantsData();
  }, [numberOfGuests, setNumberOfGuests]);

  return (
    <main className="search-container">
      <div className="search-component-container">
        <SearchComponent
          horizontal={true}
          onSearch={() => getRestaurantsData()}
        />
      </div>
      <div className="search-results-container">
        <div className="filters-container">
          <ul className="filter-item">
            <li className="filter-type">Type of Cuisine</li>
            {allCuisines?.map((cuisine, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={cuisine}
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={handleCuisineChange}
                />{" "}
                {cuisine}
              </label>
            ))}
          </ul>
          <div className="filter-item">
            <li className="filter-type">Price</li>
            <label>
              <input
                type="checkbox"
                value="$"
                checked={selectedPrices.includes("$")}
                onChange={handlePriceChange}
              />{" "}
              $
            </label>
            <label>
              <input
                type="checkbox"
                value="$$"
                checked={selectedPrices.includes("$$")}
                onChange={handlePriceChange}
              />{" "}
              $$
            </label>
            <label>
              <input
                type="checkbox"
                value="$$$"
                checked={selectedPrices.includes("$$$")}
                onChange={handlePriceChange}
              />{" "}
              $$$
            </label>
            <label>
              <input
                type="checkbox"
                value="$$$$"
                checked={selectedPrices.includes("$$$$")}
                onChange={handlePriceChange}
              />{" "}
              $$$$
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Rating</li>
            <label>
              <input
                type="checkbox"
                value="1"
                checked={selectedRatings.includes("1")}
                onChange={handleRatingChange}
              />
              <span>⭐</span>
            </label>
            <label>
              <input
                type="checkbox"
                value="2"
                checked={selectedRatings.includes("2")}
                onChange={handleRatingChange}
              />
              <span>⭐⭐</span>
            </label>
            <label>
              <input
                type="checkbox"
                value="3"
                checked={selectedRatings.includes("3")}
                onChange={handleRatingChange}
              />
              <span>⭐⭐⭐</span>
            </label>
            <label>
              <input
                type="checkbox"
                value="4"
                checked={selectedRatings.includes("4")}
                onChange={handleRatingChange}
              />
              <span>⭐⭐⭐⭐</span>
            </label>
            <label>
              <input
                type="checkbox"
                value="5"
                checked={selectedRatings.includes("5")}
                onChange={handleRatingChange}
              />
              <span>⭐⭐⭐⭐⭐</span>
            </label>
          </div>
          <div className="filter-item">
            <li className="filter-type">Location</li>
            {allLocations?.map((location, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={location}
                  checked={selectedLocations.includes(location)}
                  onChange={handleLocationChange}
                />{" "}
                {location}
              </label>
            ))}
          </div>
        </div>
        <div className="results-container">
          {searchTerm && <h2>{`Results for "${searchTerm}"`}</h2>}
          <div className="restaurant-list">
            {filteredRestaurants.map((restaurant, index) => (
              <RestaurantBox horizontal={true} key={index} {...restaurant} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
