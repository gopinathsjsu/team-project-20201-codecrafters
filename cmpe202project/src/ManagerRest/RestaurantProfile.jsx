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
  const [newPhotos, setNewPhotos] = useState([]);

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
    averageRating: 0,
    totalReviews: 0,
    hours: {},
    imageUrls: [],
    deletedImages: [],
  });

  // Axios interceptor to add token to requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
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
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  const createRestaurant = async (formData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${BASE_URL}/api/restaurants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
        console.log("Fetched restaurants:", data);
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
    const files = Array.from(e.target.files);
    setNewPhotos(files);
  };

  const handleRemoveExistingImage = (urlToRemove) => {
    setNewRestaurant((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
      deletedImages: [...prev.deletedImages, urlToRemove],
    }));
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
      formData.append("totalReviews", Number(newRestaurant.totalReviews));
      formData.append("averageRating", Number(newRestaurant.averageRating));

      // Append hours
      daysOfWeek.forEach((day) => {
        const times = newRestaurant.hours[day];
        if (times?.start) formData.append(`hours[${day}].start`, times.start);
        if (times?.end) formData.append(`hours[${day}].end`, times.end);
      });

      // Append images
      newPhotos.forEach((photo) => {
        formData.append("images", photo);
      });

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
      setNewPhotos([]);
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
              imageUrls: [],
              deletedImages: [],
            });
            setNewPhotos([]);
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
            <div
              className="restaurant-card"
              key={restaurant.id}
              style={{
                display: 'flex',
                flexDirection: 'column', // or 'column'
                alignItems: 'flex-start', // vertical alignment
                justifyContent: 'flex-start' // horizontal alignment
              }}
            >
              <h3 style={{ textAlign: 'center', alignSelf: 'center' }}>
                {restaurant.name}
                <div style={{ color: 'red' }}>{!restaurant.approved && 'In Review'}</div>
              </h3>
              <table style={{ borderSpacing: '0 10px' }}>
                <tbody>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Description:</strong></td>
                    <td>{restaurant.description}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Address:</strong></td>
                    <td>{restaurant.address}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Phone:</strong></td>
                    <td>{restaurant.phone}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Cuisine:</strong></td>
                    <td>{restaurant.cuisine}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Cost Rating:</strong></td>
                    <td>{restaurant.costRating}</td>
                  </tr>
                  <tr style={{ verticalAlign: 'top' }}>
                    <td><strong>Capacity:</strong></td>
                    <td>{restaurant.capacity}</td>
                  </tr>
                </tbody>
              </table>
              {restaurant.imageUrls?.[0] && (
                <img
                  src={restaurant.imageUrls[0]}
                  alt="Preview"
                  className="photo-preview"
                />
              )}
              <button
                className="edit-btn"
                style={{ width: '100%' }}
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
                    costRating: restaurant.costRating || 1,
                    averageRating: restaurant.averageRating || 0,
                    totalReviews: restaurant.totalReviews || 0,
                    capacity: restaurant.capacity,
                    hours: restaurant.hours || {},
                    imageUrls: restaurant.imageUrls || [],
                    deletedImages: [],
                  });
                  setNewPhotos([]);
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
                {(newPhotos.length > 0 ||
                  newRestaurant.imageUrls?.length > 0) && (
                  <div className="image-preview-container">
                    {newPhotos.map((photo, idx) => (
                      <div key={idx} className="image-preview-box">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`New Upload ${idx + 1}`}
                          className="photo-preview"
                        />
                      </div>
                    ))}

                    {newRestaurant.imageUrls.map((url, idx) => (
                      <div key={idx} className="image-preview-box">
                        <img
                          src={url}
                          alt={`Existing ${idx + 1}`}
                          className="photo-preview"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(url)}
                          className="remove-image-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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
                    setNewPhotos([]);
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
