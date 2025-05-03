package com.example.server.repository;

import com.example.server.entity.Reservation;
import com.example.server.entity.ReservationStatus;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByRestaurant_Id(String restaurantId);

    List<Reservation> findByUser_Id(String userId);

List<Reservation> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end);

List<Reservation> findAllByRestaurant_IdAndDateTimeBetween(String restaurantId, LocalDateTime start, LocalDateTime end);

    List<Reservation> findAllByRestaurant_IdAndDateTime(String restaurantId, LocalDateTime dateTime);

    List<Reservation> findAllByRestaurant_IdAndDateTimeAfterOrderByDateTimeAsc(String restaurantId, LocalDateTime now);

    boolean existsByUser_IdAndRestaurant_IdAndStatus(String userId, String restaurantId, ReservationStatus status);

    Optional<Reservation> findByIdAndUser(String id, UserInfo user);

    @Query(value = "{ 'restaurant.$id': { $in: ?0 } }", delete = true)
    long deleteAllByRestaurantIds(List<ObjectId> restaurantIds);
    
    @Query("{ 'status' : ?0, 'dateTime' : { $lte: ?1 } }")
    List<Reservation> findAllByStatusAndDateTimeLessThanEqual(ReservationStatus status, LocalDateTime dateTime);

    Optional<Reservation> findTopByUser_IdAndRestaurant_IdAndStatusOrderByDateTimeDesc(String userId, String restaurantId, ReservationStatus status);
}
