import axios from "axios";
import { BASE_URL } from "../config/api";

export const fetchRestaurants = async (token) => {
  if (!token) throw new Error("No authentication token found");

  try {
    const response = await axios.get(`${BASE_URL}/api/restaurants/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    throw err;
  }
};
