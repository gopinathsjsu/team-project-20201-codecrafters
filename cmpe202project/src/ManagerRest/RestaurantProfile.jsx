import React, { useState, useEffect } from "react";
import "../styles/RestaurantProfile.css";
import axios from "axios";
import { BASE_URL } from "../config/api";

const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const RestaurantProfile = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    cuisine: "",
    capacity: "",
    averageRating: "",
    hours: {},
    bookingTimes: "",
    tableSizes: "",
    photo: null,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(`${BASE_URL}/api/restaurants/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  const handleNewChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleNewPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRestaurant({ ...newRestaurant, photo: file });
      setNewPhoto(file);
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      for (const key in newRestaurant) {
        if (key === "hours") {
          for (const day in newRestaurant.hours) {
            const { start, end } = newRestaurant.hours[day];
            if (start) formData.append(`hours[${day}].start`, start);
            if (end) formData.append(`hours[${day}].end`, end);
          }
        } else if (key === "photo") {
          if (newRestaurant.photo) {
            formData.append("photo", newRestaurant.photo, newRestaurant.photo.name || "restaurant.jpg");
          }
        } else if (newRestaurant[key] !== undefined && newRestaurant[key] !== "") {
          formData.append(key, newRestaurant[key]);
        }
      }

      // Debug FormData (optional)
      // for (let [key, value] of formData.entries()) console.log(`${key}: ${value}`);

      let response;
      if (editingIndex !== null) {
        const restaurantId = restaurants[editingIndex]._id;
        response = await axios.put(`${BASE_URL}/api/restaurants/${restaurantId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updated = [...restaurants];
        updated[editingIndex] = response.data;
        setRestaurants(updated);
      } else {
        response = await axios.post(`${BASE_URL}/api/restaurants`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants([...restaurants, response.data]);
      }

      setNewRestaurant({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        cuisine: "",
        capacity: "",
        averageRating: "",
        hours: {},
        bookingTimes: "",
        tableSizes: "",
        photo: null,
      });
      setNewPhoto(null);
      setShowModal(false);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error submitting restaurant:", err);
      if (err.response?.data) {
        console.error("Backend response:", err.response.data);
      }
      setError(err.message);
    }
  };

  if (loading) return <div className="restaurant-card-wrapper">Loading...</div>;
  if (error) return <div className="restaurant-card-wrapper" style={{ color: "black" }}>Error: {error}</div>;

  return (
    <div className="restaurant-card-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <h2 className="restaurant-title">
          {restaurants.length > 0 ? "Your Restaurant Listings" : "Your Restaurant Dashboard"}
        </h2>
        <button
          onClick={() => {
            setNewRestaurant({
              name: "",
              description: "",
              address: "",
              city: "",
              state: "",
              zip: "",
              phone: "",
              email: "",
              cuisine: "",
              capacity: "",
              averageRating: "",
              hours: {},
              bookingTimes: "",
              tableSizes: "",
              photo: null,
            });
            setNewPhoto(null);
            setEditingIndex(null);
            setShowModal(true);
          }}
          className="edit-btn"
        >
          + Add New Listing
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="empty-restaurant-state">
          <div className="empty-state-content">
            <h3>No Restaurants Listed Yet</h3>
            <p>Get started by adding your first restaurant to manage bookings and attract customers</p>
            <button
              onClick={() => setShowModal(true)}
              className="edit-btn"
              style={{ padding: "10px 20px", fontSize: "1.1rem" }}
            >
              Create Your First Restaurant
            </button>
          </div>
        </div>
      ) : (
        <div className="restaurant-grid">
          {restaurants.map((restaurant, index) => (
            <div className="restaurant-card" key={restaurant._id}>
              <h3>{restaurant.name}</h3>
              <p><strong>Description:</strong> {restaurant.description}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>City:</strong> {restaurant.city}</p>
              <p><strong>State:</strong> {restaurant.state}</p>
              <p><strong>ZIP:</strong> {restaurant.zip}</p>
              <p><strong>Phone:</strong> {restaurant.phone}</p>
              <p><strong>Email:</strong> {restaurant.email}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p><strong>Capacity:</strong> {restaurant.capacity}</p>
              <p><strong>Rating:</strong> {restaurant.averageRating}</p>
              <p><strong>Booking Times:</strong> {restaurant.bookingTimes}</p>
              <p><strong>Table Sizes:</strong> {restaurant.tableSizes}</p>
              {restaurant.photo && (
                <img src={restaurant.photo} alt="Preview" className="photo-preview" />
              )}
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingIndex(index);
                  setNewRestaurant({ ...restaurant });
                  setShowModal(true);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingIndex !== null ? "Edit Restaurant Info" : "Add New Restaurant Listing"}</h3>
            <form onSubmit={handleNewSubmit}>
              {[
                "name", "description", "address", "city", "state", "zip", "phone",
                "email", "cuisine", "capacity", "averageRating", "bookingTimes", "tableSizes"
              ].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === "capacity" || field === "averageRating" ? "number" : "text"}
                    name={field}
                    value={newRestaurant[field] || ""}
                    onChange={handleNewChange}
                    className="form-input"
                  />
                </div>
              ))}

              <h4>Operating Hours (only fill if open)</h4>
              {daysOfWeek.map((day) => (
                <div key={day} className="form-group">
                  <label className="form-label">{day}</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="time"
                      value={newRestaurant.hours?.[day]?.start || ""}
                      onChange={(e) =>
                        setNewRestaurant((prev) => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...(prev.hours?.[day] || {}), start: e.target.value },
                          },
                        }))
                      }
                    />
                    <input
                      type="time"
                      value={newRestaurant.hours?.[day]?.end || ""}
                      onChange={(e) =>
                        setNewRestaurant((prev) => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...(prev.hours?.[day] || {}), end: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Photo</label>
                <input type="file" accept="image/*" onChange={handleNewPhotoChange} className="form-input" />
                {newPhoto && <img src={URL.createObjectURL(newPhoto)} alt="Preview" className="photo-preview" />}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="save-btn">
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setEditingIndex(null);
                  setNewPhoto(null);
                }} className="edit-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
