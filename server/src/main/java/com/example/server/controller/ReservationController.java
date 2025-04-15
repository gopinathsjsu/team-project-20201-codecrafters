package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.reservation.ReservationCreateDTO;
import com.example.server.dto.reservation.ReservationUpdateDTO;
import com.example.server.entity.Reservation;
import com.example.server.entity.ReservationStatus;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import com.example.server.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // User book a reservation
    @PostMapping("/restaurants/{restaurantId}/reservations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> createReservation(@AuthenticationPrincipal UserInfoUserDetails userDetails,
                                               @PathVariable String restaurantId,
                                               @RequestBody ReservationCreateDTO dto) {
        UserInfo user = userDetails.getUserInfo();
        reservationService.createReservation(user.getId(), restaurantId, dto);
        return ResponseEntity.status(201)
                .body("Reservation created successfully for restaurant with ID: " + restaurantId);
    }

    // Managers get their reservations from a restaurant
    @GetMapping("/restaurants/{restaurantId}/reservations")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<List<Reservation>> getAllByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(reservationService.findAllByRestaurantId(restaurantId));
    }

    // Managers can view a single reservation of their restaurant
    @GetMapping("/restaurants/{restaurantId}/reservations/{reservationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<Reservation> getReservation(@PathVariable String restaurantId, @PathVariable String reservationId) {
        Reservation reservation = reservationService.findByIdAndRestaurantId(reservationId, restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(reservation);
    }

    // Update reservation
    @PutMapping("/restaurants/{restaurantId}/reservations/{reservationId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> updateReservation(@AuthenticationPrincipal UserInfo user,
                                               @PathVariable String restaurantId,
                                               @PathVariable String reservationId,
                                               @RequestBody ReservationUpdateDTO dto) {
        if (user.getRoles().contains("USER") && !dto.getStatus().equals(ReservationStatus.CANCELLED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User can only cancel the reservation");
        }

        if (reservationService.findByIdAndRestaurantId(reservationId, restaurantId).isPresent()) {
            reservationService.updateStatus(reservationId, dto.getStatus());
            return ResponseEntity.status(HttpStatus.OK).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
    }

    // Only the manager who own the restaurant can delete the reservation from that restaurant
    @DeleteMapping("/restaurants/{restaurantId}/reservations/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> deleteReservation(@PathVariable String id,
                                               @PathVariable String restaurantId,
                                               @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Reservation reservation = reservationService.findByIdAndRestaurantId(id, restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation not found"));
        Restaurant restaurant = reservation.getRestaurant();
        UserInfo user = userDetails.getUserInfo();

        if (restaurant.getUserInfo().getId().equals(user.getId())) {
            reservationService.deleteReservation(reservation.getId());
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this reservation");
        }
    }

    // Users can access their reservations
    @GetMapping("/reservations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Reservation>> getAllByUserId(@AuthenticationPrincipal UserInfoUserDetails userDetails) {
        UserInfo user = userDetails.getUserInfo();
        return ResponseEntity.ok(reservationService.findAllByUserId(user.getId()));
    }

    // Users can see a single reservation
    @GetMapping("/reservations/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        Optional<Reservation> reservationOptional = reservationService.findById(id);
        if (reservationOptional.isPresent()) {
            return ResponseEntity.ok(reservationOptional.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
