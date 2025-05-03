package com.example.server.dto.reservation;

import java.time.LocalDateTime;

import com.example.server.entity.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDTO {
    private String id;
    private String email;
    private String restaurantId;
    private LocalDateTime dateTime; // formatted as "yyyy-MM-dd'T'HH:mm:ss"
    private int partySize;
    private ReservationStatus status;
}
