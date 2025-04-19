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

export { getRestaurants };
