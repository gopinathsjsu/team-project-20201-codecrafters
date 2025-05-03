package com.example.server.dto.reservation;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationTimeRangeDTO {
    private LocalDateTime timeStart;
    private LocalDateTime timeEnd;

}
