package com.example.server.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreateDTO {
    private LocalDateTime dateTime; // formatted as "yyyy-MM-dd'T'HH:mm:ss"
    private int partySize;
}
