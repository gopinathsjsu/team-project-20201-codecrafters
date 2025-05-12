import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClass =
    {
      small: "spinner-small",
      medium: "spinner-medium",
      large: "spinner-large",
    }[size] || "spinner-medium";

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
