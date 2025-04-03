package com.example.server.dto.reservation;

import com.example.server.entity.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationUpdateDTO {
    private LocalDate date;
    private LocalTime time;
    private int partySize;
    private ReservationStatus status;
}
