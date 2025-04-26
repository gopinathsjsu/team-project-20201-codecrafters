package com.example.server.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    @DBRef
    @JsonIgnore
    private UserInfo user;

    @DBRef
    @JsonIgnore
    private Restaurant restaurant;

    private LocalDateTime dateTime; // formatted as "yyyy-MM-dd'T'HH:mm:ss"

    private int partySize;

    ReservationStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
