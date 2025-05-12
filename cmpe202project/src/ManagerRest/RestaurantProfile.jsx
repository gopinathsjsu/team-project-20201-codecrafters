import React, { useState, useEffect } from "react";
import "../styles/RestaurantProfile.css";
import axios from "axios";
import { BASE_URL } from "../config/api";
import { fetchRestaurants } from "../utils/fetchRestaurants";

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

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
    costRating: 1,
    capacity: 0,
    hours: {},
    images: [],
    deletedImages: [],
  });

  // Axios interceptor to add token to requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  const createRestaurant = async (formData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${BASE_URL}/api/restaurants`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  };

  const updateRestaurant = async (restaurantId, formData) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${BASE_URL}/api/restaurants/${restaurantId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating restaurant:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const data = await fetchRestaurants(token);
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleNewPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  const handleRemoveImage = () => {
    setNewRestaurant((prev) => ({
      ...prev,
      deletedImages: [
        ...prev.deletedImages,
        ...prev.images.filter((img) => typeof img === "string"),
      ],
      images: [],
    }));
    setNewPhoto(null);
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append basic fields
      Object.keys(newRestaurant).forEach((key) => {
        if (
          key !== "images" &&
          key !== "deletedImages" &&
          key !== "id" &&
          key !== "hours"
        ) {
          formData.append(key, newRestaurant[key]);
        }
      });

      // Append hours
      daysOfWeek.forEach((day) => {
        const times = newRestaurant.hours[day];
        if (times?.start) formData.append(`hours[${day}].start`, times.start);
        if (times?.end) formData.append(`hours[${day}].end`, times.end);
      });

      // Append images
      if (newPhoto) {
        formData.append("images", newPhoto);
      }

      if (newRestaurant.deletedImages.length > 0) {
        newRestaurant.deletedImages.forEach((img) => {
          formData.append("deletedImages", img);
        });
      }

      if (editingIndex !== null) {
        const restaurantId = newRestaurant.id || restaurants[editingIndex].id;
        await updateRestaurant(restaurantId, formData);
      } else {
        await createRestaurant(formData);
      }

      // Refresh data
      const token = getAuthToken();
      const data = await fetchRestaurants(token);
      setRestaurants(data);
      
      setShowModal(false);
      setEditingIndex(null);
      setNewPhoto(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="restaurant-card-wrapper">Loading...</div>;
  }

  if (error) {
    return (
      <div className="restaurant-card-wrapper" style={{ color: "black" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="restaurant-card-wrapper">
      <div className="restaurant-header">
        <h2 className="restaurant-title">
          {restaurants.length > 0
            ? "Your Restaurant Listings"
            : "Your Restaurant Dashboard"}
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
              costRating: 1,
              capacity: 1,
              hours: {},
              images: [],
              deletedImages: [],
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
            <p>
              Get started by adding your first restaurant to manage bookings and
              attract customers
            </p>
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
            <div className="restaurant-card" key={restaurant.id}>
              <h3>{restaurant.name}</h3>
              <p>
                <strong>Description:</strong> {restaurant.description}
              </p>
              <p>
                <strong>Address:</strong> {restaurant.address}
              </p>
              <p>
                <strong>Phone:</strong> {restaurant.phone}
              </p>
              <p>
                <strong>Cuisine:</strong> {restaurant.cuisine}
              </p>
              <p>
                <strong>Cost Rating:</strong> {restaurant.costRating}
              </p>
              <p>
                <strong>Capacity:</strong> {restaurant.capacity}
              </p>
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
                    costRating: restaurant.costRating,
                    capacity: restaurant.capacity,
                    hours: restaurant.hours || {},
                    images: restaurant.images || [],
                    deletedImages: [],
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
            <h3>
              {editingIndex !== null
                ? "Edit Restaurant Info"
                : "Add New Restaurant Listing"}
            </h3>
            <form onSubmit={handleNewSubmit}>
              {[
                "name",
                "description",
                "address",
                "city",
                "state",
                "zip",
                "phone",
                "email",
                "cuisine",
                "costRating",
              ].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
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

              <h4>Operating Hours (only fill if open)</h4>
              {daysOfWeek.map((day) => (
                <div key={day} className="form-group">
                  <label className="form-label">{day}</label>
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={newRestaurant.hours?.[day]?.start || ""}
                      onChange={(e) =>
                        setNewRestaurant((prev) => ({
                          ...prev,
                          hours: {
                            ...prev.hours,
                            [day]: {
                              ...(prev.hours?.[day] || {}),
                              start: e.target.value,
                            },
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
                            [day]: {
                              ...(prev.hours?.[day] || {}),
                              end: e.target.value,
                            },
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
                  <div className="image-preview-container">
                    <img
                      src={
                        newPhoto
                          ? URL.createObjectURL(newPhoto)
                          : newRestaurant.images[0]
                      }
                      alt="Preview"
                      className="photo-preview"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="form-actions">
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