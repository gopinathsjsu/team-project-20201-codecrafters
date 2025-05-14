import React, { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import SearchComponent from "../components/SearchComponent";
import RestaurantBox from "../components/RestaurantBox";
import RestaurantMap from "../components/RestaurantMap";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getRestaurants,
  useApiCall,
  getReservationsInRange,
} from "../utils/apiCalls";
import "../styles/SearchResultsPage.css";

const SearchResultsPage = () => {
  const { numberOfGuests, searchTerm, setNumberOfGuests } =
    useContext(ReservationContext);

  const {
    data: allRestaurants,
    isLoading: isDataLoading,
    error,
  } = useApiCall(getRestaurants);

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Restaurant "open now" check function
  const isRestaurantOpen = (restaurant) => {
    if (!restaurant.hours) return false;

    const now = new Date();
    const pacificTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );

    const dayIndex = pacificTime.getDay();
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const today = days[dayIndex];

    if (!restaurant.hours[today]) return false;

    const { start, end } = restaurant.hours[today];
    if (!start || !end) return false;

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    const currentHours = pacificTime.getHours();
    const currentMinutes = pacificTime.getMinutes();

    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    const openTimeInMinutes = startHours * 60 + startMinutes;
    const closeTimeInMinutes = endHours * 60 + endMinutes;

    return (
      currentTimeInMinutes >= openTimeInMinutes &&
      currentTimeInMinutes <= closeTimeInMinutes
    );
  };

  // Update the sorting logic in the allRestaurants useEffect
  useEffect(() => {
    const processRestaurantsWithBookings = async () => {
      if (allRestaurants && Array.isArray(allRestaurants)) {
        const validRestaurants = allRestaurants.filter((r) => r && r.id);

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(now.setHours(24, 0, 0, 0)).toISOString();

        let reservationsToday = [];
        try {
          reservationsToday = await getReservationsInRange(
            startOfDay,
            endOfDay
          );
        } catch (e) {
          console.error("Failed to fetch today's reservations", e);
        }

        const bookedCountMap = {};
        reservationsToday.forEach((res) => {
          const resId = res.restaurantId;
          bookedCountMap[resId] = (bookedCountMap[resId] || 0) + 1;
        });

        const restaurantsWithBookings = validRestaurants.map((restaurant) => ({
          ...restaurant,
          bookedTimes: bookedCountMap[restaurant.id] || 0,
        }));

        setRestaurants(restaurantsWithBookings);
        setFilteredRestaurants(restaurantsWithBookings);
      }
    };

    processRestaurantsWithBookings();
  }, [allRestaurants]);

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...restaurants];

    if (searchTerm && searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter((restaurant) => {
        const name = restaurant.name?.toLowerCase() || "";
        const cuisine = restaurant.cuisine?.toLowerCase() || "";
        const address = restaurant.address?.toLowerCase() || "";
        const city = restaurant.city?.toLowerCase() || "";
        const state = restaurant.state?.toLowerCase() || "";
        const zip = restaurant.zip?.toLowerCase() || "";
        const description = restaurant.description?.toLowerCase() || "";

        return (
          name.includes(searchTermLower) ||
          cuisine.includes(searchTermLower) ||
          address.includes(searchTermLower) ||
          city.includes(searchTermLower) ||
          state.includes(searchTermLower) ||
          zip.includes(searchTermLower) ||
          description.includes(searchTermLower)
        );
      });

      // Sort strictly by: name > cuisine > other fields
      filtered = filtered.sort((a, b) => {
        const aName = a.name?.toLowerCase() || "";
        const aCuisine = a.cuisine?.toLowerCase() || "";
        const bName = b.name?.toLowerCase() || "";
        const bCuisine = b.cuisine?.toLowerCase() || "";

        // Helper to get match priority
        function getPriority(r) {
          const name = r.name?.toLowerCase() || "";
          const cuisine = r.cuisine?.toLowerCase() || "";
          const address = r.address?.toLowerCase() || "";
          const city = r.city?.toLowerCase() || "";
          const state = r.state?.toLowerCase() || "";
          const zip = r.zip?.toLowerCase() || "";
          const description = r.description?.toLowerCase() || "";
          if (name.includes(searchTermLower)) return 3;
          if (cuisine.includes(searchTermLower)) return 2;
          if (
            address.includes(searchTermLower) ||
            city.includes(searchTermLower) ||
            state.includes(searchTermLower) ||
            zip.includes(searchTermLower) ||
            description.includes(searchTermLower)
          )
            return 1;
          return 0;
        }
        const aPriority = getPriority(a);
        const bPriority = getPriority(b);
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        // If same priority, sort alphabetically by name
        return aName.localeCompare(bName);
      });
    }

    if (selectedCuisines.length > 0) {
      filtered = filtered.filter((restaurant) =>
        selectedCuisines.includes(restaurant.cuisine)
      );
    }

    if (selectedPrices.length > 0) {
      filtered = filtered.filter((restaurant) => {
        const cost =
          restaurant.costRating && restaurant.costRating > 0
            ? restaurant.costRating
            : 1;
        return selectedPrices.includes("$".repeat(cost));
      });
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((restaurant) => {
        const minRating = Math.min(...selectedRatings.map(Number));
        return restaurant.averageRating >= minRating;
      });
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((restaurant) =>
        selectedLocations.includes(restaurant.city)
      );
    }

    if (showOpenOnly) {
      filtered = filtered.filter(isRestaurantOpen);
    }

    setFilteredRestaurants(filtered);
  };

  // Filter change handlers
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

  const handlePriceChange = (e) => {
    const { value, checked } = e.target;
    console.log("Price filter changed:", value, checked);
    console.log("Selected prices before change:", selectedPrices);
    if (checked) {
      setSelectedPrices([...selectedPrices, value]);
    } else {
      setSelectedPrices(selectedPrices.filter((price) => price !== value));
    }
  };

  const handleRatingChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRatings([...selectedRatings, value]);
    } else {
      setSelectedRatings(selectedRatings.filter((rating) => rating !== value));
    }
  };

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

  const handleOpenNowChange = (e) => {
    setShowOpenOnly(e.target.checked);
  };

  // Clear all filters handler
  const clearAllFilters = () => {
    setSelectedCuisines([]);
    setSelectedPrices([]);
    setSelectedRatings([]);
    setSelectedLocations([]);
    setShowOpenOnly(false);
  };

  // Apply filters when filter criteria change
  useEffect(() => {
    if (restaurants.length > 0) {
      applyFilters();
    }
  }, [
    selectedCuisines,
    selectedPrices,
    selectedRatings,
    selectedLocations,
    showOpenOnly,
  ]);

  // Extract unique cuisines and locations
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

  // Initial data fetch
  useEffect(() => {
    if (numberOfGuests === "") {
      setNumberOfGuests(1);
    }
  }, [numberOfGuests, setNumberOfGuests]);

  // Load Google Maps API
  useEffect(() => {
    if (
      !window.google &&
      !document.querySelector('script[src*="maps.googleapis"]')
    ) {
      setIsMapLoading(true);
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places&loading=async&callback=initMap`;
      googleMapScript.async = true;
      googleMapScript.defer = true;

      // Set up callback function
      window.initMap = () => {
        setMapLoaded(true);
        setIsMapLoading(false);
      };

      document.head.appendChild(googleMapScript);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <main className="search-container">
      <div className="search-component-container">
        <SearchComponent horizontal={true} />
        <div className="view-toggle">
          <button
            className="view-toggle-btn"
            onClick={() => toggleViewMode(viewMode === "list" ? "map" : "list")}
          >
            {viewMode === "list" ? (
              <>
                <span className="toggle-icon">🗺️</span> Switch to Map View
              </>
            ) : (
              <>
                <span className="toggle-icon">📋</span> Switch to List View
              </>
            )}
          </button>
        </div>
      </div>

      <div className="search-results-container">
        <div className="filters-container">
          <div className="filter-item open-now-filter">
            <label className="special-filter">
              <input
                type="checkbox"
                checked={showOpenOnly}
                onChange={handleOpenNowChange}
              />
              <span className="open-indicator">Open Now</span>
            </label>
          </div>
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

          {/* Loading spinner */}
          {isDataLoading && (
            <div className="loading-container">
              <LoadingSpinner size="large" text="Finding restaurants..." />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>Error loading restaurants: {error}</p>
              <button onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Show content when loaded */}
          {!isDataLoading && !error && (
            <>
              {viewMode === "list" ? (
                <div className="restaurant-list">
                  {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant, index) => (
                      <RestaurantBox
                        horizontal={true}
                        key={
                          restaurant.id
                            ? `restaurant-${restaurant.id}`
                            : `restaurant-${index}`
                        }
                        {...restaurant}
                      />
                    ))
                  ) : (
                    <div className="no-results">
                      <p>No restaurants match your current filters.</p>
                      <button onClick={clearAllFilters}>
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <RestaurantMap
                  restaurants={filteredRestaurants}
                  isRestaurantOpen={isRestaurantOpen}
                  mapLoaded={mapLoaded}
                  onClearFilters={clearAllFilters}
                  isLoading={isMapLoading}
                  setIsLoading={setIsMapLoading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchResultsPage;
