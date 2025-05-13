import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../context/ReservationContext"; 

const TimeSlotsComponent = ({
  timeSlots = [],
  name,
  address = "",
  id = "",
  hours = {},
  reservationDate,
}) => {
  const navigate = useNavigate();
  const { setReservationTime, reservationTime } =
    useContext(ReservationContext);

  const toPacificTime = (date) => {
    return new Date(
      date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );
  };

  const getPacificDate = () => {
    if (!reservationDate) return toPacificTime(new Date());
    const localDate = new Date(reservationDate + "T00:00:00");
    return toPacificTime(localDate);
  };

  const isRestaurantOpen = () => {
    const pacificDate = getPacificDate();
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const today = days[pacificDate.getDay()];

    return !!(hours && hours[today] && hours[today].start && hours[today].end);
  };

  const isTimeSlotAvailable = (timeSlot) => {
    const pacificDate = getPacificDate();
    const now = toPacificTime(new Date());

    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const today = days[pacificDate.getDay()];

    if (!hours || !hours[today] || !hours[today].start || !hours[today].end) {
      return false;
    }

    const [openHours, openMinutes] = hours[today].start.split(":").map(Number);
    const [closeHours, closeMinutes] = hours[today].end.split(":").map(Number);

    const [time, period] = timeSlot.split(" ");
    let [slotHours, slotMinutes] = time.split(":").map(Number);
    if (period === "PM" && slotHours !== 12) slotHours += 12;
    else if (period === "AM" && slotHours === 12) slotHours = 0;

    const slotTime = new Date(pacificDate);
    slotTime.setHours(slotHours, slotMinutes, 0, 0);

    const openTime = new Date(pacificDate);
    openTime.setHours(openHours, openMinutes, 0, 0);

    const closeTime = new Date(pacificDate);
    closeTime.setHours(closeHours, closeMinutes, 0, 0);

    return (
      slotTime >= openTime &&
      slotTime <= new Date(closeTime.getTime() - 60 * 60 * 1000) &&
      slotTime >= now
    );
  };

  const handleReservation = (timeString, event) => {
    if (event) event.stopPropagation();

    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    hours = String(hours).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    setReservationTime(formattedTime);
    navigate("/booking", {
      state: {
        name,
        address,
        id,
        timeZone: "America/Los_Angeles",
      },
    });
  };

  const generateDefaultTimeSlots = () => {
    const pacificDate = getPacificDate();
    const now = toPacificTime(new Date());

    let [hour, minute] = reservationTime
      ? reservationTime.split(":").map(Number)
      : [pacificDate.getHours(), pacificDate.getMinutes()];

    const baseTime = new Date(pacificDate);
    baseTime.setHours(hour, minute, 0, 0);

    const roundedTime = new Date(baseTime);
    const remainder = roundedTime.getMinutes() % 30;
    if (remainder !== 0) {
      roundedTime.setMinutes(roundedTime.getMinutes() + (30 - remainder));
    }

    const slots = [];
    let count = 0;
    let i = 0;

    while (count < 3 && i < 20) {
      const slotTime = new Date(roundedTime.getTime() + i * 30 * 60000);
      i++;

      if (slotTime < now) continue;

      const formattedTime = slotTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Los_Angeles",
      });

      if (isTimeSlotAvailable(formattedTime)) {
        slots.push(formattedTime);
        count++;
      }
    }

    return slots;
  };

  const availableTimeSlots = isRestaurantOpen()
    ? (timeSlots.length > 0 ? timeSlots : generateDefaultTimeSlots())
        .filter(isTimeSlotAvailable)
        .slice(0, 3)
    : [];

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
