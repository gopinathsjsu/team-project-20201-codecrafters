import React, { createContext, useState } from "react";

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ReservationContext.Provider
      value={{
        reservationDate,
        setReservationDate,
        reservationTime,
        setReservationTime,
        numberOfGuests,
        setNumberOfGuests,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
