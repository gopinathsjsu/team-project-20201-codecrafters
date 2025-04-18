import React, { useState } from "react";
import "../styles/RestaurantProfile.css";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState({
    name: "Lemon Diner",
    address: "123 Citrus St, San Jose, CA",
    contact: "(408) 123-4567",
    description: "A cozy diner specializing in lemon-inspired cuisine.",
    hours: "Mon-Sun: 10am - 10pm",
    bookingTimes: "11:00, 13:00, 18:00",
    tableSizes: "2, 4, 6",
    status: "Active",
  });

  const [photo, setPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated restaurant:", restaurant);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Restaurant Manager Profile</h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Basic Info</h3>
              <div className="form-group"><label>Name</label><input type="text" name="name" value={restaurant.name} onChange={handleChange} /></div>
              <div className="form-group"><label>Address</label><input type="text" name="address" value={restaurant.address} onChange={handleChange} /></div>
              <div className="form-group"><label>Contact</label><input type="text" name="contact" value={restaurant.contact} onChange={handleChange} /></div>
            </div>

            <div className="form-section">
              <h3>Description</h3>
              <div className="form-group"><label>Description</label><textarea name="description" value={restaurant.description} onChange={handleChange} rows={3} /></div>
            </div>

            <div className="form-section">
              <h3>Settings</h3>
              <div className="form-group"><label>Hours</label><input type="text" name="hours" value={restaurant.hours} onChange={handleChange} /></div>
              <div className="form-group"><label>Booking Times</label><input type="text" name="bookingTimes" value={restaurant.bookingTimes} onChange={handleChange} /></div>
              <div className="form-group"><label>Table Sizes</label><input type="text" name="tableSizes" value={restaurant.tableSizes} onChange={handleChange} /></div>
            </div>

            <div className="form-group">
              <label>Photo</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              {photo && <img src={photo} alt="Preview" className="photo-preview" />}
            </div>

            <button type="submit" className="save-btn">Save</button>
          </form>
        ) : (
          <div className="profile-display">
            <p><strong>Name:</strong> {restaurant.name}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Contact:</strong> {restaurant.contact}</p>
            <p><strong>Description:</strong> {restaurant.description}</p>
            <p><strong>Hours:</strong> {restaurant.hours}</p>
            <p><strong>Booking Times:</strong> {restaurant.bookingTimes}</p>
            <p><strong>Table Sizes:</strong> {restaurant.tableSizes}</p>
            {photo && <img src={photo} alt="Preview" className="photo-preview" />}
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;
