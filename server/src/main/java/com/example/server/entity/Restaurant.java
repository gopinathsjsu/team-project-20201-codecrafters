package com.example.server.entity;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
    private double averageRating;
    private double totalReviews;
    private Map<DayOfWeek, TimeInterval> hours;
    //private Map<DayOfWeek, List<TimeInterval>> bookingHours;
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
