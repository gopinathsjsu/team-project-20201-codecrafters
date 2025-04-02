package com.example.server.repository;

import com.example.server.entity.Reservation;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String>  {
    List<Reservation> findByRestaurant_Id(String restaurantId);

    List<Reservation> findByUser_Id(String userId);

    List<Reservation> findAllByDateBetween(LocalDate date, LocalDate date2);

    List<Reservation> findAllByTimeBetween(LocalTime startTime, LocalTime startTime1);

    List<Reservation> findAllByRestaurant_IdAndDateAndTime(String restaurantId, LocalDate date, LocalTime time);

    Optional<Reservation> findByIdAndUser(String id, UserInfo user);

    Optional<Reservation> findByIdAndRestaurant(String id, Restaurant restaurant);

    Optional<Reservation> findByUser_IdAndRestaurant_IdAndDateAndTime(String userId, String restaurantId, LocalDate date, LocalTime time);
}
