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
    const { name, value } = e.target;
    setNewRestaurant(prev => ({
      ...prev,
      [name]: name === "capacity" || name === "averageRating" ? Number(value) : value
    }));
  };

  const handleNewPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRestaurant(prev => ({
        ...prev,
        images: [file]
      }));
      setNewPhoto(file);
    }
  };

  const handleRemoveImage = () => {
    setNewRestaurant(prev => ({
      ...prev,
      images: [],
      deletedImages: [...prev.deletedImages, ...prev.images.filter(img => typeof img === 'string')]
    }));
    setNewPhoto(null);
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const formData = new FormData();

      // Append simple fields
      Object.keys(newRestaurant).forEach(key => {
        if (key === 'hours') {
          Object.entries(newRestaurant.hours).forEach(([day, {start, end}]) => {
            if (start && end) {
              formData.append(`hours[${day}].start`, start);
              formData.append(`hours[${day}].end`, end);
            }
          });
        } 
        else if (key === 'images') {
          newRestaurant.images.forEach(file => {
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
        }
        else if (key === 'deletedImages') {
          newRestaurant.deletedImages.forEach(url => {
            formData.append('deletedImages', url);
          });
        }
        else if (key !== 'deletedImages') {
          formData.append(key, newRestaurant[key]);
        }
      });

      let response;
      if (editingIndex !== null) {
        const restaurantId = restaurants[editingIndex]._id;
        response = await axios.put(`${BASE_URL}/api/restaurants/${restaurantId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        const updated = [...restaurants];
        updated[editingIndex] = response.data;
        setRestaurants(updated);
      } else {
        response = await axios.post(`${BASE_URL}/api/restaurants`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setRestaurants([...restaurants, response.data]);
      }

      // Reset form
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
      setShowModal(false);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error submitting restaurant:", err);
      setError(err.response?.data?.message || err.message);
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
                  setEditingIndex(index);
                  setNewRestaurant({ 
                    ...restaurant,
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
                      onChange={(e) =>
                        setNewRestaurant(prev => ({
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
                        setNewRestaurant(prev => ({
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