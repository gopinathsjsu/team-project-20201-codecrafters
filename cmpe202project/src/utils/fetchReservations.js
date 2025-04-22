import axios from "axios";
import { BASE_URL } from "../config/api";

export const fetchReservations = async (token, restaurantId) => {
  if (!token) throw new Error("No authentication token found");
  if (!restaurantId) throw new Error("Restaurant ID is missing");

  try {
    const response = await axios.get(
      `${BASE_URL}/api/restaurants/${restaurantId}/reservations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching reservations:", err);
    throw err;
  }
};
