package com.example.server.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import com.example.server.dto.reservation.ReservationCreateDTO;
import com.example.server.entity.*;
import com.example.server.repository.ReservationRepository;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.UserInfoRepository;

import jakarta.validation.constraints.NotNull;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    public Reservation createReservation(String userId, String restaurantId,
            ReservationCreateDTO reservationCreateDTO) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));


        LocalDateTime reservationDateTime = reservationCreateDTO.getDateTime();
        LocalDate reservationDate = reservationDateTime.toLocalDate();
        LocalTime reservationTime = reservationDateTime.toLocalTime();

        // Check if the reservation date is in the past
        if (reservationDate.isBefore(LocalDate.now()) || (reservationDate.isEqual(LocalDate.now()) && reservationTime.isBefore(LocalTime.now()))) {
            throw new RuntimeException("Reservation date and time must be in the future");
        }
        // Check if the reservation date is within the restaurant's booking hours
        if (!restaurant.isOpenAt(reservationDateTime)) {
            throw new RuntimeException("The restaurant is not available at this date and time.");
        }
        // Check if the reservation date is within the restaurant's hours
        if (!isAvailable(user, restaurant, reservationCreateDTO)) {
            throw new RuntimeException("Exceeded maximum number of available reservations");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRestaurant(restaurant);
        BeanUtils.copyProperties(reservationCreateDTO, reservation);
        reservation.setStatus(ReservationStatus.PENDING);
        reservationRepository.save(reservation);

        // Send reservation message to RabbitMQ
        sendConfirmationSms("+18777804236", reservation);
        return reservation;
    }


    public void deleteReservation(@NotNull String id) {
        reservationRepository.deleteById(id);
    }

    public Optional<Reservation> findById(String id) {
        return reservationRepository.findById(id);
    }

    public Reservation findByIdAndUserId(String id, String userId) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("The reservation does not exist"));
    }

    public Optional<Reservation> findByIdAndRestaurantId(String id, String restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
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

    public List<Reservation> findAllByDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return reservationRepository.findAllByDateTimeBetween(startDate, endDate);
    }

    public boolean isAvailable(UserInfo user, Restaurant restaurant, ReservationCreateDTO reservationCreateDTO) {
        boolean hasPending = reservationRepository.existsByUser_IdAndRestaurant_IdAndStatus(
                user.getId(),
                restaurant.getId(),
                ReservationStatus.PENDING);

        if (hasPending) {
            throw new RuntimeException("You can only have one reservation at the same restaurant for a specific time.");
        }
        List<Reservation> reservationsAtTime = reservationRepository
                .findAllByRestaurant_IdAndDateTime(
                        restaurant.getId(),
                        reservationCreateDTO.getDateTime());
        int totalGuest = reservationsAtTime.stream().mapToInt(Reservation::getPartySize).sum();
        return totalGuest + reservationCreateDTO.getPartySize() <= restaurant.getCapacity();
    }

    private void sendConfirmationSms(String toPhoneNumber, Reservation reservation) {
        String formattedDate = reservation.getDateTime().toLocalDate().format(DATE_FORMATTER);
        String formattedTime = reservation.getDateTime().toLocalTime().format(TIME_FORMATTER);

        String message = String.format(
                "Hi %s, your reservation on %s at %s for %d people is created.",
                reservation.getUser().getUsername(), formattedDate, formattedTime, reservation.getPartySize());

        Message.creator(
                new PhoneNumber(toPhoneNumber),
                new PhoneNumber(fromPhoneNumber),
                message).create();
    }
}
