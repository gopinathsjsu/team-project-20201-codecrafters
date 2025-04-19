
import React, { useState } from "react";
import "../styles/RestaurantProfile.css";

const RestaurantProfile = () => {
  const [restaurants, setRestaurants] = useState([
    {
      name: "Lemon Diner",
      address: "123 Citrus St, San Jose, CA",
      contact: "(408) 123-4567",
      description: "A cozy diner specializing in lemon-inspired cuisine.",
      hours: "Mon-Sun: 10am - 10pm",
      bookingTimes: "11:00, 13:00, 18:00",
      tableSizes: "2, 4, 6",
      photo: null,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

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

  const [newPhoto, setNewPhoto] = useState(null);

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

  const handleNewSubmit = (e) => {
    e.preventDefault();
    setRestaurants([...restaurants, newRestaurant]);
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
  };

  const handleEditChange = (e) => {
    const updated = [...restaurants];
    updated[editingIndex][e.target.name] = e.target.value;
    setRestaurants(updated);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditingIndex(null);
  };

  return (
    <div className="restaurant-card-wrapper">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <h2 className="restaurant-title">Your Restaurant Listings</h2>
        <button onClick={() => setShowModal(true)} className="edit-btn">+ Add New Listing</button>
      </div>

      <div className="restaurant-grid">
        {restaurants.map((restaurant, index) => (
          <div className="restaurant-card" key={index}>
            {editingIndex === index ? (
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
                    <img src={restaurant.photo} alt="Current" className="photo-preview" />
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
                              updated[index].photo = URL.createObjectURL(file);
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
                          updated[index].photo = URL.createObjectURL(file);
                          setRestaurants(updated);
                        }
                      }}
                    />
                  </div>
                )}
                <button type="submit" className="save-btn">Save</button>
              </form>
            ) : (
              <>
                <h3>{restaurant.name}</h3>
                <p><strong>Address:</strong> {restaurant.address}</p>
                <p><strong>Contact:</strong> {restaurant.contact}</p>
                <p><strong>Description:</strong> {restaurant.description}</p>
                <p><strong>Hours:</strong> {restaurant.hours}</p>
                <p><strong>Booking Times:</strong> {restaurant.bookingTimes}</p>
                <p><strong>Table Sizes:</strong> {restaurant.tableSizes}</p>
                {restaurant.photo && <img src={restaurant.photo} alt="Preview" className="photo-preview" />}
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
