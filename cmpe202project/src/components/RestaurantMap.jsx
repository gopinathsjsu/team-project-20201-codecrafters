import React, { useEffect, useState, useRef } from "react";
import "../styles/RestaurantMap.css";

const RestaurantMap = ({
  restaurants,
  isRestaurantOpen,
  mapLoaded,
  onClearFilters,
  isLoading: parentIsLoading,
  setIsLoading: setParentIsLoading,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [geocodedRestaurants, setGeocodedRestaurants] = useState({});
  const [infoWindows, setInfoWindows] = useState([]);

  const geocodeRestaurants = async (restaurantsToGeocode) => {
    if (!window.google || !window.google.maps) return {};

    const geocoder = new window.google.maps.Geocoder();
    const geocoded = { ...geocodedRestaurants };

    const uncachedRestaurants = restaurantsToGeocode.filter(
      (restaurant) => !geocoded[restaurant.id]
    );

    const batchSize = 5;
    for (let i = 0; i < uncachedRestaurants.length; i += batchSize) {
      const batch = uncachedRestaurants.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (restaurant) => {
          const address = `${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip}`;

          try {
            const response = await new Promise((resolve, reject) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results.length > 0) {
                  resolve(results[0]);
                } else {
                  reject(status);
                }
              });
            });

            geocoded[restaurant.id] = {
              lat: response.geometry.location.lat(),
              lng: response.geometry.location.lng(),
            };
          } catch (error) {
            console.warn(`Failed to geocode ${address}: ${error}`);
            geocoded[restaurant.id] = { lat: 37.3352, lng: -121.8811 };
          }
        })
      );

      if (i + batchSize < uncachedRestaurants.length) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    setGeocodedRestaurants(geocoded);
    return geocoded;
  };

  useEffect(() => {
    return () => {
      infoWindows.forEach((infoWindow) => infoWindow.close());
    };
  }, [infoWindows]);

  useEffect(() => {
    const initializeMap = async () => {
      if (mapLoaded && restaurants.length > 0 && mapRef.current) {
        setParentIsLoading(true);

        try {
          let mapInstance = map;
          if (!mapInstance) {
            mapInstance = new window.google.maps.Map(mapRef.current, {
              center: { lat: 37.3352, lng: -121.8811 },
              zoom: 12,
              mapId: "DEMO_MAP_ID",
            });
            setMap(mapInstance);
          }

          // Clear existing markers and info windows
          markers.forEach((marker) => {
            if (marker.map) {
              marker.map = null;
            }
          });

          infoWindows.forEach((infoWindow) => infoWindow.close());

          setMarkers([]);
          setInfoWindows([]);

          const coords = await geocodeRestaurants(restaurants);

          const newMarkers = [];
          const newInfoWindows = [];

          // Import marker library
          const { AdvancedMarkerElement } = await google.maps.importLibrary(
            "marker"
          );

          // Create a shared infoWindow
          const sharedInfoWindow = new google.maps.InfoWindow();
          newInfoWindows.push(sharedInfoWindow);

          for (const restaurant of restaurants) {
            const coordinates = coords[restaurant.id];
            if (!coordinates) continue;

            // Create marker content
            const markerElement = document.createElement("div");
            markerElement.className = "custom-marker";
            markerElement.innerHTML = `
              <div class="marker-pin ${
                isRestaurantOpen(restaurant) ? "open" : "closed"
              }">
                <span class="marker-icon">🍽️</span>
              </div>
            `;

            // Create the marker
            const marker = new AdvancedMarkerElement({
              position: coordinates,
              map: mapInstance,
              title: restaurant.name,
              content: markerElement,
            });

            // Create infoWindow content (defined here but used in the click handler)
            const infoContent = `
              <div class="map-info-window">
                <h2>${restaurant.name}</h2>
                <p>${restaurant.cuisine} · ${"$".repeat(
              Math.max(1, restaurant.costRating)
            )}</p>
                <p>${restaurant.address}, ${restaurant.city}</p>
                <p>${
                  isRestaurantOpen(restaurant)
                    ? '<span style="color: green; font-weight: bold;">Open Now</span>'
                    : '<span style="color: red;">Closed</span>'
                }</p>
                <button 
                  class="info-window-button" 
                  onclick="window.location.href='/restaurant/${restaurant.id}'"
                >
                  View Details
                </button>
              </div>
            `;

            // Add click event listener using the correct event type
            marker.addEventListener("click", () => {
              // Set content and open the shared info window
              sharedInfoWindow.setContent(infoContent);
              sharedInfoWindow.open({
                map: mapInstance,
                anchor: marker,
              });
            });

            newMarkers.push(marker);
          }

          setMarkers(newMarkers);
          setInfoWindows(newInfoWindows);

          // Fit map bounds to show all markers
          if (newMarkers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            newMarkers.forEach((marker) => {
              bounds.extend(marker.position);
            });

            mapInstance.fitBounds(bounds);

            // Don't zoom in too far
            const listener = google.maps.event.addListener(
              mapInstance,
              "idle",
              () => {
                if (mapInstance.getZoom() > 16) mapInstance.setZoom(16);
                google.maps.event.removeListener(listener);
              }
            );
          }
        } catch (error) {
          console.error("Error initializing map:", error);
        } finally {
          setParentIsLoading(false);
        }
      }
    };

    initializeMap();
  }, [mapLoaded, restaurants]);

  return (
    <div className="map-container">
      {parentIsLoading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}
      {restaurants.length > 0 ? (
        <div className="google-map" ref={mapRef}></div>
      ) : (
        <div className="no-results">
          <p>No restaurants match your current filters to display on map.</p>
          <button onClick={onClearFilters}>Clear all filters</button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;
