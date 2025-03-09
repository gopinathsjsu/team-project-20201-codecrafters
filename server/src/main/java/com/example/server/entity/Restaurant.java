package com.example.server.entity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Restaurant {
    @NotNull
    private String username;
    @Id
    private String id;
    @NotBlank(message = "The name cannot be blanked")
    private String name;
    private String description;
    @NotBlank(message = "The address cannot be blanked")
    private String address;
    @NotBlank(message = "The city cannot be blanked")
    private String city;
    @NotBlank(message = "The state cannot be blanked")
    private String state;
    @NotBlank(message = "The zipcode cannot be blanked")
    private String zip;
    private String phone;
    private String email;
    private String cuisine;
    @Min(value = 1)
    private int capacity;
    @Min(value = 0)
    @Max(value = 5)
    private double costRating;
    private Map<DayOfWeek, List<String>> hours;
    private Map<DayOfWeek, List<String>> bookingHours;
    private boolean approved;
}
