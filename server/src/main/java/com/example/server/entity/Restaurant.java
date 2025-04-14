package com.example.server.entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "restaurants")
public class Restaurant {
    @DBRef @JsonIgnore
    private UserInfo userInfo;

    @Id
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

    private boolean approved;
    
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public boolean isOpenAt(LocalDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();
        TimeInterval interval = this.hours.get(day);
        return interval != null && interval.contains(dateTime.toLocalTime());
    }
}
