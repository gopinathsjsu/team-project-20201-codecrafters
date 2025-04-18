import React, { useState } from "react";
import "../styles/RestaurantProfile.css";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState({
    name: "Lemon Diner",
    address: "123 Citrus St, San Jose, CA",
    contact: "(408) 123-4567",
    description: "A cozy diner specializing in lemon-inspired cuisine.",
    status: "Active",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated restaurant:", restaurant);
    setIsEditing(false);
  };

  return (
    <div className="restaurant-card-wrapper">
      <div className="restaurant-card">
        <h2 className="restaurant-title">🍋 Restaurant Profile</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="restaurant-form">
            {["name", "address", "contact", "description"].map((field) => (
              <div className="form-group" key={field}>
                <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "description" ? (
                  <textarea
                    name="description"
                    value={restaurant.description}
                    onChange={handleChange}
                    className="form-input"
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={restaurant[field]}
                    onChange={handleChange}
                    className="form-input"
                  />
                )}
              </div>
            ))}

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={restaurant.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="text-right">
              <button type="submit" className="btn-save">💾 Save</button>
            </div>
          </form>
        ) : (
          <div className="restaurant-info">
            <p><strong>Name:</strong> {restaurant.name}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Contact:</strong> {restaurant.contact}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-${restaurant.status.toLowerCase()}`}>
                {restaurant.status}
              </span>
            </p>
            <p><strong>Description:</strong> {restaurant.description}</p>

            <div className="text-right">
              <button onClick={() => setIsEditing(true)} className="btn-edit">✏️ Edit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;
