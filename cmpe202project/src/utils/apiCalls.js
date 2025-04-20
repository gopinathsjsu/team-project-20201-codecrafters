import axios from "axios";
import { BASE_URL } from "../config/api.js";

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
    const response = await axios.post(
      `${BASE_URL}/api/restaurants/${id}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error submitting review for restaurant with ID ${id}:`,
      error
    );
    return null;
  }
};

export { getRestaurants, getRestaurantById, reviewRestaurant };
