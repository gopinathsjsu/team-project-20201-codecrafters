package com.example.server.dto.restaurant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeIntervalDTO {
    private LocalTime start;
    private LocalTime end;
}
