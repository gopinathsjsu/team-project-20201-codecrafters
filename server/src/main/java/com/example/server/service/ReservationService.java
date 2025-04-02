package com.example.server.service;

import com.example.server.dto.reservation.ReservationCreateDTO;
import com.example.server.entity.*;
import com.example.server.repository.ReservationRepository;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.UserInfoRepository;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    public Reservation createReservation(@NotNull ReservationCreateDTO reservationCreateDTO) {
        if (!isAvailable(reservationCreateDTO)) {
            throw new RuntimeException("Exceeded maximum number of available reservations");
        }

        UserInfo user = userInfoRepository.findById(reservationCreateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(reservationCreateDTO.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRestaurant(restaurant);
        reservation.setDate(reservationCreateDTO.getDate());
        reservation.setTime(reservationCreateDTO.getTime());
        reservation.setPartySize(reservationCreateDTO.getPartySize());

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(@NotNull String id) {
        reservationRepository.deleteById(id);
    }

    public Optional<Reservation> findById(String id) {
        return reservationRepository.findById(id);
    }

    public Optional<Reservation> findByIdAndUserId(String id, String userId) {
        UserInfo user = userInfoRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByIdAndUser(id, user);
    }

    public Optional<Reservation> findByIdAndRestaurantId(String id, String restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return reservationRepository.findByIdAndRestaurant(id, restaurant);
    }

    public List<Reservation> findAllByRestaurantId(String restaurantId) {
        return reservationRepository.findByRestaurant_Id(restaurantId);
    }

    public List<Reservation> findAllByUserId(String userId) {
        return reservationRepository.findByUser_Id(userId);
    }

    public void updateStatus(String id, ReservationStatus status) {
        reservationRepository.findById(id).ifPresent(reservation -> {
            reservation.setStatus(status);
            reservationRepository.save(reservation);
        });
    }

    public List<Reservation> findAllByDateBetween(LocalDate startDate, LocalDate endDate) {
        return reservationRepository.findAllByDateBetween(startDate, endDate);
    }

    public List<Reservation> findAllByTimeBetween(LocalTime startTime, LocalTime endTime) {
        return reservationRepository.findAllByTimeBetween(startTime, startTime);
    }

    public boolean isAvailable(ReservationCreateDTO reservationCreateDTO) {
        Restaurant restaurant = restaurantRepository.findById(reservationCreateDTO.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // User can only book once for the same time and date
        Optional<Reservation> reservationOptional = reservationRepository.findByUser_IdAndRestaurant_IdAndDateAndTime(
                reservationCreateDTO.getUserId(),
                reservationCreateDTO.getRestaurantId(),
                reservationCreateDTO.getDate(),
                reservationCreateDTO.getTime()
        );
        if (reservationOptional.isPresent()) {
            throw new RuntimeException("User can only book reservation once for the same time and date");
        }

        List<Reservation> reservations = reservationRepository.findAllByRestaurant_IdAndDateAndTime(
                reservationCreateDTO.getRestaurantId(),
                reservationCreateDTO.getDate(),
                reservationCreateDTO.getTime()
        );

        int totalGuest = reservations.stream().mapToInt(Reservation::getPartySize).sum();

        return totalGuest + reservationCreateDTO.getPartySize() <= restaurant.getCapacity();
    }
}
