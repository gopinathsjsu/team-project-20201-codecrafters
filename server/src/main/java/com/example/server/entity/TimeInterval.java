package com.example.server.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Setter
@Getter
@Data
@NoArgsConstructor
public class TimeInterval {

    private LocalTime start;
    private LocalTime end;

    public TimeInterval(LocalTime start, LocalTime end) {
        this.start = start;
        this.end = end;
    }

    public boolean contains(LocalTime time) {
        return !start.isAfter(time) && !end.isBefore(time);
    }

    public boolean contains(LocalDateTime dateTime) {
        return contains(dateTime.toLocalTime());
    }
}
