package com.example.server.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Setter
@Getter
@Data
@NoArgsConstructor
public class TimeInterval {

    private String start; // formatted as "HH:mm"
    private String end;
    @JsonIgnore
    public LocalTime getStartAsLocalTime() {
        return (start != null) ? LocalTime.parse(start) : null;
    }
    @JsonIgnore
    public LocalTime getEndAsLocalTime() {
        return (end != null) ? LocalTime.parse(end) : null;
    }


    public boolean contains(LocalTime time) {
        LocalTime startTime = getStartAsLocalTime();
        LocalTime endTime = getEndAsLocalTime();
    
        if (startTime == null || endTime == null || time == null) return false;
    
        return !startTime.isAfter(time) && !endTime.isBefore(time);
    }
}
