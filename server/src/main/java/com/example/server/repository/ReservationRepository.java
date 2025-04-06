package com.example.server.repository;

import com.example.server.entity.Reservation;
import com.example.server.entity.ReservationStatus;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByRestaurant_Id(String restaurantId);

    List<Reservation> findByUser_Id(String userId);

    List<Reservation> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Reservation> findAllByRestaurant_IdAndDateTime(String restaurantId, LocalDateTime dateTime);

    boolean existsByUser_IdAndRestaurant_IdAndStatus(String userId,String restaurantId, ReservationStatus status);

    Optional<Reservation> findByIdAndUser(String id, UserInfo user);

    Optional<Reservation> findByIdAndRestaurant(String id, Restaurant restaurant);


}
