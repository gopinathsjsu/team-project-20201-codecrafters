

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
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
        } else {
          formData.append(key, newRestaurant[key]);
        }
      }

      const response = await axios.post(`${BASE_URL}/api/restaurants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setRestaurants([...restaurants, response.data]);
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (e, index) => {
    const updated = [...restaurants];
    updated[index][e.target.name] = e.target.value;
    setRestaurants(updated);
  };

  const handleEditSubmit = async (e, index) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const restaurantToUpdate = restaurants[index];
      const formData = new FormData();

      for (const key in restaurantToUpdate) {
        if (key === "hours") {
          for (const day in restaurantToUpdate.hours) {
            const { start, end } = restaurantToUpdate.hours[day];
            if (start) formData.append(`hours[${day}].start`, start);
            if (end) formData.append(`hours[${day}].end`, end);
          }
        } else if (key === "photo") {
          if (restaurantToUpdate.photo && typeof restaurantToUpdate.photo !== "string") {
            formData.append("photo", restaurantToUpdate.photo, restaurantToUpdate.photo.name || "restaurant.jpg");
          }
        } else {
          formData.append(key, restaurantToUpdate[key]);
        }
      }

      const response = await axios.put(`${BASE_URL}/api/restaurants/${restaurantToUpdate._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedRestaurants = [...restaurants];
      updatedRestaurants[index] = response.data;
      setRestaurants(updatedRestaurants);
      setEditingIndex(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="restaurant-card-wrapper">
      {error && <div style={{ color: "black" }}>Error: {error}</div>}
      <h2 className="restaurant-title">Your Restaurant Listings</h2>
      <button onClick={() => setShowModal(true)} className="edit-btn">+ Add New Listing</button>

      <div className="restaurant-grid">
        {restaurants.map((restaurant, index) => (
          <div key={restaurant._id} className="restaurant-card">
            {editingIndex === index ? (
              <form onSubmit={(e) => handleEditSubmit(e, index)} className="edit-form-scrollable">
                {["name", "description", "address", "city", "state", "zip", "phone", "email", "cuisine", "capacity", "averageRating", "bookingTimes", "tableSizes"].map((field) => (
                  <div className="form-group" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      name={field}
                      value={restaurant[field] || ""}
                      onChange={(e) => handleEditChange(e, index)}
                      className="form-input"
                    />
                  </div>
                ))}

                {daysOfWeek.map((day) => (
                  <div className="form-group" key={day}>
                    <label className="form-label">{day}</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="time"
                        value={restaurant.hours?.[day]?.start || ""}
                        onChange={(e) => {
                          const updated = [...restaurants];
                          updated[index].hours = {
                            ...updated[index].hours,
                            [day]: {
                              ...(updated[index].hours?.[day] || {}),
                              start: e.target.value,
                            },
                          };
                          setRestaurants(updated);
                        }}
                      />
                      <input
                        type="time"
                        value={restaurant.hours?.[day]?.end || ""}
                        onChange={(e) => {
                          const updated = [...restaurants];
                          updated[index].hours = {
                            ...updated[index].hours,
                            [day]: {
                              ...(updated[index].hours?.[day] || {}),
                              end: e.target.value,
                            },
                          };
                          setRestaurants(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="form-group">
                  <label className="form-label">Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const updated = [...restaurants];
                      updated[index].photo = file;
                      setRestaurants(updated);
                    }
                  }} />
                  {restaurant.photo && (
                    <img
                      src={typeof restaurant.photo === "string" ? restaurant.photo : URL.createObjectURL(restaurant.photo)}
                      alt="Preview"
                      className="photo-preview"
                    />
                  )}
                </div>

                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={() => setEditingIndex(null)} className="edit-btn">Cancel</button>
              </form>
            ) : (
              <>
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
                <button onClick={() => setEditingIndex(index)} className="edit-btn">Edit</button>
              </>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Restaurant Listing</h3>
            <form onSubmit={handleNewSubmit}>
              {["name", "description", "address", "city", "state", "zip", "phone", "email", "cuisine", "capacity", "averageRating", "bookingTimes", "tableSizes"].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field}</label>
                  <input
                    name={field}
                    value={newRestaurant[field] || ""}
                    onChange={handleNewChange}
                    className="form-input"
                  />
                </div>
              ))}

              {daysOfWeek.map((day) => (
                <div className="form-group" key={day}>
                  <label className="form-label">{day}</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="time"
                      onChange={(e) => setNewRestaurant((prev) => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: {
                            ...(prev.hours[day] || {}),
                            start: e.target.value,
                          },
                        },
                      }))}
                    />
                    <input
                      type="time"
                      onChange={(e) => setNewRestaurant((prev) => ({
                        ...prev,
                        hours: {
                          ...prev.hours,
                          [day]: {
                            ...(prev.hours[day] || {}),
                            end: e.target.value,
                          },
                        },
                      }))}
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
                <button type="submit" className="save-btn">Add</button>
                <button type="button" onClick={() => setShowModal(false)} className="edit-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
