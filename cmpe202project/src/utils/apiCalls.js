import axios from "axios";
import { BASE_URL } from "../config/api.js";

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
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching restaurant with ID ${id}:`, error);
    return null;
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
    // Improve error logging to see more details
    console.error("Error confirming reservation:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

export {
  getRestaurants,
  getRestaurantById,
  reviewRestaurant,
  confirmReservation,
  getRestaurantReviews,
};
