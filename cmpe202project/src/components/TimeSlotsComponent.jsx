import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";

const TimeSlotsComponent = ({
  timeSlots = [],
  name,
  address = "",
  id = "",
}) => {
  const navigate = useNavigate();
  const { setReservationTime } = useContext(ReservationContext);

  // Helper function to convert any date to Pacific Time
  const toPacificTime = (date) => {
    return new Date(
      date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
  };

  const handleReservation = (timeString, event) => {
    // Stop event propagation to prevent parent onClick handlers from firing
    if (event) {
      event.stopPropagation();
    }

    // Parse the time string into 24-hour format
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    // Ensure hours and minutes are properly formatted
    hours = String(hours).padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;

    setReservationTime(formattedTime); // Set the time in 24-hour format
    navigate("/booking", {
      state: {
        name,
        address,
        id,
        timeZone: "America/Los_Angeles", // Pass timezone info to booking page
      },
    });
  };

  // Generate default time slots when none are provided
  const generateDefaultTimeSlots = () => {
    // Get current time in Pacific Time
    const now = new Date();
    const pacificNow = toPacificTime(now);

    const currentHour = pacificNow.getHours();
    const currentMinute = pacificNow.getMinutes();

    // Round up to next 30-minute interval
    const minutesToAdd = (30 - (currentMinute % 30)) % 30;
    const baseTime = new Date(pacificNow);
    baseTime.setMinutes(currentMinute + minutesToAdd);
    if (minutesToAdd === 0) {
      // If we're exactly on a 30-minute mark, add 30 minutes
      baseTime.setMinutes(baseTime.getMinutes() + 30);
    }

    // Create 30 minutes after base time
    const thirtyMinLater = new Date(baseTime);
    thirtyMinLater.setMinutes(baseTime.getMinutes() + 30);

    // Create 60 minutes after base time
    const sixtyMinLater = new Date(baseTime);
    sixtyMinLater.setMinutes(baseTime.getMinutes() + 60);

    // Format the times as strings (e.g., "7:30 PM")
    const formatTimeSlot = (date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Los_Angeles",
      });
    };

    return [
      formatTimeSlot(baseTime),
      formatTimeSlot(thirtyMinLater),
      formatTimeSlot(sixtyMinLater),
    ];
  };

  // Use provided time slots or generate default ones
  const displayTimeSlots =
    timeSlots.length > 0 ? timeSlots : generateDefaultTimeSlots();

  return (
    <div className="availability">
      {displayTimeSlots.map((time, index) => (
        <span
          key={index}
          className="time-slot"
          onClick={(event) => handleReservation(time, event)}
        >
          {time}
        </span>
      ))}
    </div>
  );
};

export default TimeSlotsComponent;
