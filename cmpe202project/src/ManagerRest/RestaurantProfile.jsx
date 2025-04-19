import React, { useState, useEffect } from "react";
import "../styles/RestaurantProfile.css";
import axios from "axios";

const RestaurantProfile = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    contact: "",
    description: "",
    hours: "",
    bookingTimes: "",
    tableSizes: "",
    photo: null,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          "http://team-project-20201-codecrafters-production.up.railway.app/api/restaurant/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      const preview = URL.createObjectURL(file);
      setNewRestaurant({ ...newRestaurant, photo: preview });
      setNewPhoto(preview);
    }
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("name", newRestaurant.name);
      formData.append("address", newRestaurant.address);
      formData.append("contact", newRestaurant.contact);
      formData.append("description", newRestaurant.description);
      formData.append("hours", newRestaurant.hours);
      formData.append("bookingTimes", newRestaurant.bookingTimes);
      formData.append("tableSizes", newRestaurant.tableSizes);

      if (newPhoto) {
        const blob = await fetch(newPhoto).then(r => r.blob());
        formData.append("photo", blob, "restaurant.jpg");
      }

      const response = await axios.post(
        "http://team-project-20201-codecrafters-production.up.railway.app/api/restaurants",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRestaurants([...restaurants, response.data]);
      setNewRestaurant({
        name: "",
        address: "",
        contact: "",
        description: "",
        hours: "",
        bookingTimes: "",
        tableSizes: "",
        photo: null,
      });
      setNewPhoto(null);
      setShowModal(false);
    } catch (err) {
      console.error("Error creating restaurant:", err);
      setError(err.message);
    }
  };

  const handleEditChange = (e) => {
    const updated = [...restaurants];
    updated[editingIndex][e.target.name] = e.target.value;
    setRestaurants(updated);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const restaurantToUpdate = restaurants[editingIndex];
      const formData = new FormData();
      formData.append("name", restaurantToUpdate.name);
      formData.append("address", restaurantToUpdate.address);
      formData.append("contact", restaurantToUpdate.contact);
      formData.append("description", restaurantToUpdate.description);
      formData.append("hours", restaurantToUpdate.hours);
      formData.append("bookingTimes", restaurantToUpdate.bookingTimes);
      formData.append("tableSizes", restaurantToUpdate.tableSizes);

      if (restaurantToUpdate.photo && typeof restaurantToUpdate.photo !== "string") {
        const blob = await fetch(restaurantToUpdate.photo).then(r => r.blob());
        formData.append("photo", blob, "restaurant.jpg");
      }

      const response = await axios.put(
        `http://team-project-20201-codecrafters-production.up.railway.app/api/restaurants/${restaurantToUpdate._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedRestaurants = [...restaurants];
      updatedRestaurants[editingIndex] = response.data;
      setRestaurants(updatedRestaurants);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error updating restaurant:", err);
      setError(err.message);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(
        `http://team-project-20201-codecrafters-production.up.railway.app/api/restaurants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
    } catch (err) {
      console.error("Error deleting restaurant:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="restaurant-card-wrapper">Loading...</div>;
  }

  if (error) {
    return <div className="restaurant-card-wrapper">Error: {error}</div>;
  }

  return (
    <div className="restaurant-card-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <h2 className="restaurant-title">Your Restaurant Listings</h2>
        {(restaurants.length === 0 || restaurants.every(r => !r.name)) && (
          <button onClick={() => setShowModal(true)} className="edit-btn">
            + Add New Listing
          </button>
        )}
      </div>

      <div className="restaurant-grid">
        {restaurants.map((restaurant, index) => (
          <div className="restaurant-card" key={restaurant._id}>
            {editingIndex === index ? (
              <div className="edit-form-scrollable">
                <form onSubmit={handleEditSubmit}>
                  {["name", "address", "contact", "description", "hours", "bookingTimes", "tableSizes"].map((field) => (
                    <div className="form-group" key={field}>
                      <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      {field === "description" ? (
                        <textarea
                          name={field}
                          value={restaurant[field]}
                          onChange={handleEditChange}
                          className="form-input"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="text"
                          name={field}
                          value={restaurant[field]}
                          onChange={handleEditChange}
                          className="form-input"
                        />
                      )}
                    </div>
                  ))}
                  {restaurant.photo ? (
                    <div className="form-group">
                      <label className="form-label">Current Photo</label>
                      <img
                        src={typeof restaurant.photo === "string" ?
                          restaurant.photo :
                          URL.createObjectURL(restaurant.photo)}
                        alt="Current"
                        className="photo-preview"
                      />
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => {
                            const updated = [...restaurants];
                            updated[index].photo = null;
                            setRestaurants(updated);
                          }}
                        >
                          Remove
                        </button>
                        <label className="edit-btn" style={{ cursor: "pointer" }}>
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const updated = [...restaurants];
                                updated[index].photo = file;
                                setRestaurants(updated);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Add Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-input"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const updated = [...restaurants];
                            updated[index].photo = file;
                            setRestaurants(updated);
                          }
                        }}
                      />
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" className="edit-btn" onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h3>{restaurant.name}</h3>
                <p><strong>Address:</strong> {restaurant.address}</p>
                <p><strong>Contact:</strong> {restaurant.contact}</p>
                <p><strong>Description:</strong> {restaurant.description}</p>
                <p><strong>Hours:</strong> {restaurant.hours}</p>
                <p><strong>Booking Times:</strong> {restaurant.bookingTimes}</p>
                <p><strong>Table Sizes:</strong> {restaurant.tableSizes}</p>
                {restaurant.photo && (
                  <img
                    src={typeof restaurant.photo === "string" ?
                      restaurant.photo :
                      URL.createObjectURL(restaurant.photo)}
                    alt="Preview"
                    className="photo-preview"
                  />
                )}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button onClick={() => setEditingIndex(index)} className="edit-btn">Edit</button>
                  <button
                    onClick={() => handleDeleteRestaurant(restaurant._id)}
                    className="edit-btn"
                    style={{ backgroundColor: "#ff4444" }}
                  >
                    Delete
                  </button>
                </div>
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
              {["name", "address", "contact", "description", "hours", "bookingTimes", "tableSizes"].map((field) => (
                <div className="form-group" key={field}>
                  <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === "description" ? (
                    <textarea
                      name={field}
                      value={newRestaurant[field]}
                      onChange={handleNewChange}
                      className="form-input"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={newRestaurant[field]}
                      onChange={handleNewChange}
                      className="form-input"
                    />
                  )}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Photo</label>
                <input type="file" accept="image/*" onChange={handleNewPhotoChange} className="form-input" />
                {newPhoto && <img src={newPhoto} alt="Preview" className="photo-preview" />}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" className="save-btn">Add</button>
                <button onClick={() => setShowModal(false)} className="edit-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;
