import axios from "axios";
import { BASE_URL } from "../config/api.js";
import { useState, useEffect } from "react";

const getAuthToken = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.accessToken) {
      return null;
    }
    return user.accessToken;
  } catch (error) {
    console.error("Error parsing user data from session storage:", error);
    return null;
  }
};

// Consider a more centralized auth check
const checkAuthentication = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required for this operation");
  }
  return token;
};

const getRestaurants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/restaurants`);
    console.log("Raw API response:", response.data);

    if (Array.isArray(response.data)) {
      const transformedData = response.data.map((item) => {
        if (item.restaurant) {
          return {
            ...item.restaurant,
            reservationTime: item.reservationTime || [],
            bookedTimes: item.bookedTimes || 0,
          };
        }
        return item;
      });

      console.log("Transformed restaurant data:", transformedData);
      return transformedData;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/restaurants/${id}`);
    console.log(`Raw restaurant data for ID ${id}:`, response.data);

    let restaurantData = response.data;

    if (
      restaurantData &&
      typeof restaurantData === "object" &&
      !Array.isArray(restaurantData)
    ) {
      if (restaurantData.restaurant) {
        restaurantData = {
          ...restaurantData.restaurant,
          reservationTime: restaurantData.reservationTime || [],
          bookedTimes: restaurantData.bookedTimes || 0,
        };
      } else if (restaurantData.data && restaurantData.data.restaurant) {
        restaurantData = {
          ...restaurantData.data.restaurant,
          reservationTime: restaurantData.data.reservationTime || [],
          bookedTimes: restaurantData.data.bookedTimes || 0,
        };
      }
    }

    const normalizedData = {
      id: restaurantData.id || restaurantData._id || id,
      name: restaurantData.name || "Unknown Restaurant",
      address: restaurantData.address || "",
      city: restaurantData.city || "",
      state: restaurantData.state || "",
      zip: restaurantData.zip || "",
      cuisine: restaurantData.cuisine || "",
      priceRange: restaurantData.priceRange || "",
      averageRating: parseFloat(
        restaurantData.averageRating || restaurantData.rating || 0
      ),
      reviews: Array.isArray(restaurantData.reviews)
        ? restaurantData.reviews
        : [],
      imageUrls: Array.isArray(restaurantData.imageUrls)
        ? restaurantData.imageUrls
        : restaurantData.images
        ? Array.isArray(restaurantData.images)
          ? restaurantData.images
          : [restaurantData.images]
        : [],
      hours: restaurantData.hours || restaurantData.operatingHours || {},
      timeSlots: Array.isArray(restaurantData.timeSlots)
        ? restaurantData.timeSlots
        : [],
      bookedTimes:
        typeof restaurantData.bookedTimes === "number"
          ? restaurantData.bookedTimes
          : 0,
      reservationTime: Array.isArray(restaurantData.reservationTime)
        ? restaurantData.reservationTime
        : [],
      ...restaurantData,
    };

    console.log(`Normalized restaurant data for ID ${id}:`, normalizedData);
    return normalizedData;
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    console.error("Error response:", error.response?.data);

    return {
      error: true,
      message:
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch restaurant with ID ${id}`,
      status: error.response?.status,
    };
  }
};

const reviewRestaurant = async (id, reviewData) => {
  try {
    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Get the authentication token
    const token = checkAuthentication();
    if (!token) {
      throw new Error("Authentication required to submit a review");
    }

    const formattedReviewRequest = {
      rating: reviewData.rating,
      comment: reviewData.comment || "",
    };

    const response = await axios.post(
      `${BASE_URL}/api/restaurants/${id}/reviews`,
      formattedReviewRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error submitting review for restaurant with ID ${id}:`,
      error.response?.data || error.message
    );

    // Throw the error so the component can handle it
    throw error;
  }
};

const getRestaurantReviews = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/restaurants/${id}/reviews`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching reviews for restaurant with ID ${id}:`,
      error
    );
    return [];
  }
};

const confirmReservation = async (id, reservationData) => {
  try {
    const token = checkAuthentication();
    if (!token) {
      throw new Error("Authentication required to confirm a reservation");
    }

    const formattedReservationData = {
      dateTime: reservationData.dateTime,
      partySize: reservationData.partySize,
    };

    const response = await axios.post(
      `${BASE_URL}/api/restaurants/${id}/reservations`,
      formattedReservationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error confirming reservation:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

// Custom hook for API calls with loading state
const useApiCall = (apiFunction, ...args) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await apiFunction(...args);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "An error occurred");
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [apiFunction, ...args]);

  return { data, isLoading, error, refetch: () => setIsLoading(true) };
};

export {
  getRestaurants,
  getRestaurantById,
  reviewRestaurant,
  confirmReservation,
  getRestaurantReviews,
  useApiCall,
};
