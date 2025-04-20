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
    capacity: 0,
    averageRating: 0,
    hours: {},
    images: [],
    deletedImages: []
  });

  console.log("Current state:", {
    restaurants,
    loading,
    error,
    showModal,
    editingIndex,
    newPhoto,
    newRestaurant
  });

  const fetchRestaurants = async () => {
    console.log("Starting to fetch restaurants...");
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      console.log("Making API call to fetch restaurants...");
      const response = await axios.get(`${BASE_URL}/api/restaurants/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response:", response.data);
      setRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const createRestaurant = async (formData) => {
    console.log("Creating new restaurant with form data:", formData);
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    try {
      console.log("Making POST request to create restaurant...");
      const response = await axios.post(`${BASE_URL}/api/restaurants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Restaurant created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  };

  const updateRestaurant = async (restaurantId, formData) => {
    console.log(`Updating restaurant ${restaurantId} with data:`, formData);
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found");

    try {
      console.log("Making PUT request to update restaurant...");
      const response = await axios.put(`${BASE_URL}/api/restaurants/${restaurantId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Restaurant updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating restaurant:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("Component mounted - fetching restaurants");
    fetchRestaurants();
  }, []);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}: ${value}`);
    setNewRestaurant(prev => ({
      ...prev,
      [name]: name === "capacity" || name === "averageRating" ? Number(value) : value
    }));
  };

  const handleNewPhotoChange = (e) => {
    const file = e.target.files[0];
    console.log("New photo selected:", file);
    if (file) {
      setNewPhoto(file);
    }
  };

  const handleRemoveImage = () => {
    console.log("Removing image - current images:", newRestaurant.images);
    setNewRestaurant(prev => ({
      ...prev,
      deletedImages: [...prev.deletedImages, ...prev.images.filter(img => typeof img === 'string')],
      images: []
    }));
    setNewPhoto(null);
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();
      
      console.log("Building form data...");
      // Append all basic fields
      Object.keys(newRestaurant).forEach(key => {
        if (key !== 'images' && key !== 'deletedImages' && key !== 'id') {
          if (key === 'hours') {
            console.log(`Adding hours: ${JSON.stringify(newRestaurant[key])}`);
            formData.append(key, JSON.stringify(newRestaurant[key]));
          } else {
            console.log(`Adding ${key}: ${newRestaurant[key]}`);
            formData.append(key, newRestaurant[key]);
          }
        }
      });

      // Append new photo if available
      if (newPhoto) {
        console.log("Adding new photo to form data");
        formData.append('images', newPhoto);
      }

      // Append deleted images if any
      if (newRestaurant.deletedImages.length > 0) {
        console.log("Adding deleted images:", newRestaurant.deletedImages);
        formData.append('deletedImages', JSON.stringify(newRestaurant.deletedImages));
      }

      if (editingIndex !== null) {
        // Update existing restaurant
        const restaurantId = newRestaurant.id || restaurants[editingIndex].id;
        console.log(`Updating restaurant with ID: ${restaurantId}`);
        console.log("newRestaurant.id:", newRestaurant.id);
        console.log("restaurants[editingIndex].id:", restaurants[editingIndex].id);
        console.log("Complete restaurant being edited:", restaurants[editingIndex]);
        await updateRestaurant(restaurantId, formData);
      } else {
        // Create new restaurant
        console.log("Creating new restaurant");
        await createRestaurant(formData);
      }

      console.log("Operation successful, refreshing data...");
      await fetchRestaurants();
      setShowModal(false);
      setEditingIndex(null);
      setNewPhoto(null);
    } catch (err) {
      console.error("Error saving restaurant:", err);
      setError(err.message);
    }
  };

  if (loading) {
    console.log("Rendering loading state");
    return <div className="restaurant-card-wrapper">Loading...</div>;
  }
  if (error) {
    console.log("Rendering error state:", error);
    return <div className="restaurant-card-wrapper" style={{ color: "black" }}>Error: {error}</div>;
  }

  console.log("Rendering component with restaurants:", restaurants);
  return (
    <div className="restaurant-card-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <h2 className="restaurant-title">
          {restaurants.length > 0 ? "Your Restaurant Listings" : "Your Restaurant Dashboard"}
        </h2>
        <button
          onClick={() => {
            console.log("Add new listing button clicked");
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
              capacity: 0,
              averageRating: 0,
              hours: {},
              images: [],
              deletedImages: []
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
              onClick={() => {
                console.log("Create first restaurant button clicked");
                setShowModal(true);
              }}
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
            <div className="restaurant-card" key={restaurant.id}>
              <h3>{restaurant.name}</h3>
              <p><strong>ID:</strong> {restaurant.id}</p>
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
              {restaurant.images?.[0] && (
                <img 
                  src={restaurant.images[0]} 
                  alt="Preview" 
                  className="photo-preview" 
                />
              )}
              <button
                className="edit-btn"
                onClick={() => {
                  console.log(`Edit button clicked for restaurant at index ${index}`);
                  console.log("Restaurant being edited:", restaurant);
                  setEditingIndex(index);
                  setNewRestaurant({ 
                    id: restaurant.id,
                    name: restaurant.name,
                    description: restaurant.description,
                    address: restaurant.address,
                    city: restaurant.city,
                    state: restaurant.state,
                    zip: restaurant.zip,
                    phone: restaurant.phone,
                    email: restaurant.email,
                    cuisine: restaurant.cuisine,
                    capacity: restaurant.capacity,
                    averageRating: restaurant.averageRating,
                    hours: restaurant.hours || {},
                    images: restaurant.images || [],
                    deletedImages: []
                  });
                  setNewPhoto(null);
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
                "email", "cuisine"
              ].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={newRestaurant[field] || ""}
                    onChange={handleNewChange}
                    className="form-input"
                  />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={newRestaurant.capacity}
                  onChange={handleNewChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Rating</label>
                <input
                  type="number"
                  name="averageRating"
                  value={newRestaurant.averageRating}
                  onChange={handleNewChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="form-input"
                />
              </div>

              <h4>Operating Hours (only fill if open)</h4>
              {daysOfWeek.map((day) => (
                <div key={day} className="form-group">
                  <label className="form-label">{day}</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="time"
                      value={newRestaurant.hours?.[day]?.start || ""}
                      onChange={(e) => {
                        console.log(`Setting ${day} start time: ${e.target.value}`);
                        setNewRestaurant(prev => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...(prev.hours?.[day] || {}), start: e.target.value },
                          },
                        }))
                      }}
                    />
                    <input
                      type="time"
                      value={newRestaurant.hours?.[day]?.end || ""}
                      onChange={(e) => {
                        console.log(`Setting ${day} end time: ${e.target.value}`);
                        setNewRestaurant(prev => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: { ...(prev.hours?.[day] || {}), end: e.target.value },
                          },
                        }))
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Photo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleNewPhotoChange} 
                  className="form-input" 
                />
                {(newPhoto || newRestaurant.images?.[0]) && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                      src={newPhoto ? URL.createObjectURL(newPhoto) : newRestaurant.images[0]} 
                      alt="Preview" 
                      className="photo-preview" 
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="save-btn">
                  {editingIndex !== null ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Cancel button clicked");
                    setShowModal(false);
                    setEditingIndex(null);
                    setNewPhoto(null);
                  }}
                  className="edit-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;