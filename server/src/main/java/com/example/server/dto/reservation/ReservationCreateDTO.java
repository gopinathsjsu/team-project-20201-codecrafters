package com.example.server.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreateDTO {
    private String userId;
    private String restaurantId;
    private LocalDate date;
    private LocalTime time;
    private int partySize;
}
