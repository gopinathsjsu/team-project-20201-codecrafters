package com.example.server.dto.restaurant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCreateDTO {
    private String name;
    private String username;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String phone;
    private String email;
    private String cuisine;
    private int capacity;
    private double costRating;
    private Map<DayOfWeek, List<String>> hours;
    private Map<DayOfWeek, List<String>> bookingHours;
}
