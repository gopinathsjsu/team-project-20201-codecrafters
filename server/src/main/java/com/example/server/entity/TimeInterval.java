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
        return LocalTime.parse(start);
    }
    @JsonIgnore
    public LocalTime getEndAsLocalTime() {
        return LocalTime.parse(end);
    }


    public boolean contains(LocalTime time) {
        return !getStartAsLocalTime().isAfter(time) && !getEndAsLocalTime().isBefore(time);
    }

    public boolean contains(LocalDateTime dateTime) {
        return contains(dateTime.toLocalTime());
    }
}
