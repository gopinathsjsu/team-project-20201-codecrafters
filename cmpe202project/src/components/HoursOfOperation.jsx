import React from "react";

const HoursOfOperation = ({ hours }) => {
  // Helper function to format time strings
  const formatTimeString = (timeStr) => {
    if (!timeStr || timeStr === "Closed") return "Closed";

    try {
      // Parse the time string into a Date object for consistent formatting
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));

      // Format the time in 12-hour format
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeStr; // Return original string if parsing fails
    }
  };

  // Helper function to check if the restaurant is currently open
  const isCurrentlyOpen = (hours) => {
    if (!hours) return false;

    const now = new Date();
    const currentDay = now
      .toLocaleString("en-us", { weekday: "long" })
      .toUpperCase();
    const currentHours = hours[currentDay];

    if (!currentHours || !currentHours.start || !currentHours.end) return false;

    // Parse opening and closing times
    const [openHour, openMinute] = currentHours.start.split(":").map(Number);
    const [closeHour, closeMinute] = currentHours.end.split(":").map(Number);

    // Create Date objects for opening and closing times
    const openTime = new Date(now);
    openTime.setHours(openHour, openMinute, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeHour, closeMinute, 0);

    // Check if current time is between open and close times
    return now >= openTime && now <= closeTime;
  };

  return (
    <div className="restaurant-hours">
      <h3>Hours of Operation</h3>
      {hours && Object.keys(hours).length > 0 ? (
        <>
          <div className="current-status">
            {isCurrentlyOpen(hours) ? (
              <span className="open-now">Open Now</span>
            ) : (
              <span className="closed-now">Closed Now</span>
            )}
          </div>
          <ul>
            {Object.entries(hours).map(([day, hoursData]) => {
              const today = new Date()
                .toLocaleString("en-us", { weekday: "long" })
                .toUpperCase();
              const isToday = day === today;

              // Check if hoursData is an object with opening and closing times
              const openTime = hoursData?.start || "Closed";
              const closeTime = hoursData?.end || "";

              // Format the times for display
              const formattedOpen = formatTimeString(openTime);
              const formattedClose = formatTimeString(closeTime);

              return (
                <li key={day} className={isToday ? "today" : ""}>
                  <strong>{day.charAt(0) + day.slice(1).toLowerCase()}:</strong>{" "}
                  {openTime === "Closed"
                    ? "Closed"
                    : `${formattedOpen} - ${formattedClose}`}
                  {isToday && <span className="today-marker"> (Today)</span>}
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>Hours information not available</p>
      )}
    </div>
  );
};

export default HoursOfOperation;
