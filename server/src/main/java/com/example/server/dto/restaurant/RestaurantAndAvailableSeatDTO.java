package com.example.server.dto.restaurant;

import java.time.LocalDateTime;
import java.util.List;

import com.example.server.entity.Restaurant;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantAndAvailableSeatDTO {
    private Restaurant restaurant;
    private List<ReservationTime> reservationTime;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationTime {
        private int availableSeats;
        private LocalDateTime dateTime;
    }
}


