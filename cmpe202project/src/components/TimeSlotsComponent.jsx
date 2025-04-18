import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext";

const TimeSlotsComponent = ({ timeSlots, name }) => {
  const navigate = useNavigate();
  const { setReservationTime } = useContext(ReservationContext);

  const handleReservation = (e) => {
    e.stopPropagation();

    const timeString = e.target.innerText;
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    const formattedTime = `${hours}:${minutes}`;

    setReservationTime(formattedTime); // Set the time in 24-hour format
    navigate("/booking", {
      state: {
        name,
      },
    });
  };

  return (
    <div className="availability">
      {timeSlots && timeSlots.length > 0 ? (
        timeSlots.map((time, index) => (
          <span key={index} className="time-slot" onClick={handleReservation}>
            {time}
          </span>
        ))
      ) : (
        <span className="no-availability">No slots available</span>
      )}
    </div>
  );
};

export default TimeSlotsComponent;
