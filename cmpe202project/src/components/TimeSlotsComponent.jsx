import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";

const TimeSlotsComponent = ({
  timeSlots = [],
  name,
  address = "",
  id = "",
  hours = {},
}) => {
  const navigate = useNavigate();
  const { setReservationTime } = useContext(ReservationContext);

  // Helper function to convert any date to Pacific Time
  const toPacificTime = (date) => {
    return new Date(
      date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
  };

  // Check if restaurant is open today
  const isRestaurantOpen = () => {
    const pacificNow = toPacificTime(new Date());

    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const today = days[pacificNow.getDay()];

    // Check if hours exist for today
    if (!hours || !hours[today] || !hours[today].start || !hours[today].end) {
      return false; // Closed if no hours defined
    }

    return true;
  };

  // Check if a time slot is within operating hours
  const isTimeSlotAvailable = (timeSlot) => {
    // Get current date in Pacific time
    const pacificNow = toPacificTime(new Date());

    // Get day of week as string (e.g., "MONDAY")
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const today = days[pacificNow.getDay()];

    // Check if hours exist for today
    if (!hours || !hours[today] || !hours[today].start || !hours[today].end) {
      return false; // Closed if no hours defined
    }

    // Parse time slot (e.g., "7:30 PM")
    const [time, period] = timeSlot.split(" ");
    let [slotHours, slotMinutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (period === "PM" && slotHours !== 12) {
      slotHours += 12;
    } else if (period === "AM" && slotHours === 12) {
      slotHours = 0;
    }

    // Parse operating hours
    const [openHours, openMinutes] = hours[today].start.split(":").map(Number);
    const [closeHours, closeMinutes] = hours[today].end.split(":").map(Number);

    // Convert all to minutes for comparison
    const slotTimeInMinutes = slotHours * 60 + slotMinutes;
    const openTimeInMinutes = openHours * 60 + openMinutes;
    const closeTimeInMinutes = closeHours * 60 + closeMinutes;

    // Check if time slot is within operating hours
    // Allow slots up to 1 hour before closing
    return (
      slotTimeInMinutes >= openTimeInMinutes &&
      slotTimeInMinutes <= closeTimeInMinutes - 60
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
        timeZone: "America/Los_Angeles",
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

    const timeSlots = [];
    for (let i = 0; i < 3; i++) {
      const slotTime = new Date(baseTime);
      slotTime.setMinutes(baseTime.getMinutes() + i * 30);

      const formattedTime = slotTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Los_Angeles",
      });

      timeSlots.push(formattedTime);
    }

    return timeSlots;
  };

  // Get all available time slots
  const availableTimeSlots = isRestaurantOpen()
    ? (timeSlots.length > 0 ? timeSlots : generateDefaultTimeSlots()).filter(
        isTimeSlotAvailable
      )
    : [];

  // Check if restaurant is closed (no available time slots)
  const isClosed = availableTimeSlots.length === 0;

  return (
    <div className="availability">
      {isClosed ? (
        <span className="closed-message">Closed Today</span>
      ) : (
        availableTimeSlots.map((time, index) => (
          <span
            key={index}
            className="time-slot"
            onClick={(event) => handleReservation(time, event)}
          >
            {time}
          </span>
        ))
      )}
    </div>
  );
};

export default TimeSlotsComponent;
