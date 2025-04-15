package com.example.server.dto.restaurant;

import com.example.server.entity.TimeInterval;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantUpdateDTO {
    private String id;
    @NotBlank(message = "The name cannot be blanked")
    private String name;

    @Size(max = 500)
    private String description;

    @NotBlank(message = "The address cannot be blanked")
    private String address;

    @NotBlank(message = "The city cannot be blanked")
    private String city;

    @NotBlank(message = "The state cannot be blanked")
    private String state;

    @NotBlank(message = "The zipcode cannot be blanked")
    private String zip;

    @NotBlank(message = "The phone number cannot be blanked")
    private String phone;

    @Email
    private String email;

    @NotBlank(message = "The cuisine cannot be blanked")
    private String cuisine;

    @Min(value = 1)
    private int capacity;

    @DecimalMin("0.0")
    @DecimalMax("5.0")
    private double averageRating;

    @Min(value = 0)
    @Max(value = 5)
    private int costRating;

    @Min(value = 0)
    private int totalReviews;

    private Map<DayOfWeek, TimeInterval> hours;
}

