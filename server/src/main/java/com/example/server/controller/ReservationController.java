package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.reservation.ReservationCreateDTO;
import com.example.server.dto.reservation.ReservationResponseDTO;
import com.example.server.dto.reservation.ReservationTimeRangeDTO;
import com.example.server.dto.reservation.ReservationUpdateDTO;
import com.example.server.entity.Reservation;
import com.example.server.entity.ReservationStatus;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import com.example.server.service.ReservationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReservationController {

        @Autowired
        private ReservationService reservationService;

        // User book a reservation
        @PostMapping("/restaurants/{restaurantId}/reservations")
        @PreAuthorize("hasRole('USER')")
        @Operation(summary = "Create a reservation", description = "Users can create a reservation for a restaurant")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Reservation created successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
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
        @Operation(summary = "Get reservations by restaurant", description = "Managers or Admins can view reservations for their restaurant")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservations retrieved successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<List<ReservationResponseDTO>> getAllByRestaurant(@PathVariable String restaurantId,
                        @AuthenticationPrincipal UserInfoUserDetails userDetails) {
                UserInfo user = userDetails.getUserInfo();
                List<Reservation> reservationList = reservationService.findAllByRestaurantId(restaurantId,
                                user.getId());
                List<ReservationResponseDTO> dtoList = reservationList.stream().map(res -> new ReservationResponseDTO(
                                res.getId(),
                                res.getUser().getId(),
                                res.getRestaurant().getId(),
                                res.getDateTime(),
                                res.getPartySize(),
                                res.getStatus())).toList();
                return ResponseEntity.ok(dtoList);
        }

        // Managers can view a single reservation of their restaurant
        @GetMapping("/restaurants/{restaurantId}/reservations/{reservationId}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
        @Operation(summary = "Get a single reservation by restaurant", description = "Managers or Admins can view specific reservation")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservation retrieved successfully"),
                        @ApiResponse(responseCode = "404", description = "Reservation not found"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<ReservationResponseDTO> getReservation(@PathVariable String restaurantId,
                        @PathVariable String reservationId) {
                Reservation reservation = reservationService.findByIdAndRestaurantId(reservationId, restaurantId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
                ReservationResponseDTO dto = new ReservationResponseDTO(
                                reservation.getId(),
                                reservation.getUser().getEmail(),
                                reservation.getRestaurant().getId(),
                                reservation.getDateTime(),
                                reservation.getPartySize(),
                                reservation.getStatus());
                return ResponseEntity.ok(dto);
        }

        // Update reservation
        @PutMapping("/restaurants/{restaurantId}/reservations/{reservationId}")
        @PreAuthorize("hasRole('USER')")
        @Operation(summary = "Update reservation status", description = "Users only can cancel")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservation updated successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied"),
                        @ApiResponse(responseCode = "404", description = "Reservation not found")
        })
        public ResponseEntity<?> updateReservation(@AuthenticationPrincipal UserInfo user,
                        @PathVariable String restaurantId,
                        @PathVariable String reservationId,
                        @RequestBody ReservationUpdateDTO dto) {

                if (reservationService.findByIdAndRestaurantId(reservationId, restaurantId).isPresent()) {
                        reservationService.updateStatus(reservationId, dto.getStatus());
                        return ResponseEntity.status(HttpStatus.OK).build();
                }

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
        }

        // Only the manager who own the restaurant can delete the reservation from that
        // restaurant
        @DeleteMapping("/restaurants/{restaurantId}/reservations/{id}")
        @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
        @Operation(summary = "Delete a reservation", description = "Only managers of the restaurant can delete the reservation")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservation deleted successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied"),
                        @ApiResponse(responseCode = "404", description = "Reservation not found")
        })
        public ResponseEntity<?> deleteReservation(@PathVariable String id,
                        @PathVariable String restaurantId,
                        @AuthenticationPrincipal UserInfoUserDetails userDetails) {
                Reservation reservation = reservationService.findByIdAndRestaurantId(id, restaurantId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Reservation not found"));
                Restaurant restaurant = reservation.getRestaurant();
                UserInfo user = userDetails.getUserInfo();

                if (restaurant.getUserInfo().getId().equals(user.getId())) {
                        reservationService.deleteReservation(reservation.getId());
                        return ResponseEntity.status(HttpStatus.OK).build();
                } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                        .body("You are not allowed to delete this reservation");
                }
        }

        // Users can access their reservations
        @GetMapping("/reservations")
        @PreAuthorize("hasRole('USER')")
        @Operation(summary = "Get all reservations by user", description = "Users can view all their reservations")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservations retrieved successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<List<ReservationResponseDTO>> getAllByUserId(
                        @AuthenticationPrincipal UserInfoUserDetails userDetails) {
                UserInfo user = userDetails.getUserInfo();
                List<Reservation> reservations = reservationService.findAllByUserId(user.getId());

                List<ReservationResponseDTO> dtoList = reservations.stream()
                                .map(res -> new ReservationResponseDTO(
                                                res.getId(),
                                                res.getUser().getEmail(),
                                                res.getRestaurant().getId(),
                                                res.getDateTime(),
                                                res.getPartySize(),
                                                res.getStatus()))
                                .toList();

                return ResponseEntity.ok(dtoList);
        }

        // Users can see a single reservation
        @GetMapping("/reservations/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
        @Operation(summary = "Get reservation by ID", description = "View a specific reservation by ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservation retrieved successfully"),
                        @ApiResponse(responseCode = "404", description = "Reservation not found"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable String id) {
                return reservationService.findById(id)
                                .map(res -> new ReservationResponseDTO(
                                                res.getId(),
                                                res.getUser().getEmail(),
                                                res.getRestaurant().getId(),
                                                res.getDateTime(),
                                                res.getPartySize(),
                                                res.getStatus()))
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }

        // Users can see their reservations by time range
        @PostMapping("/reservations/time-range")
        @Operation(summary = "Get reservations by time range", description = "Users can view their reservations within a specific time range")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservations retrieved successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<List<ReservationResponseDTO>> getReservationsByTimeRange(
                        @RequestBody ReservationTimeRangeDTO dto) {
                List<Reservation> reservations = reservationService
                                .findByTimeRange(dto.getTimeStart(), dto.getTimeEnd());
                List<ReservationResponseDTO> response = reservations.stream()
                                .map(res -> new ReservationResponseDTO(
                                                res.getId(),
                                                res.getUser().getEmail(),
                                                res.getRestaurant().getId(),
                                                res.getDateTime(),
                                                res.getPartySize(),
                                                res.getStatus()))
                                .toList();
                return ResponseEntity.ok(response);
        }

        //Reservations for a specific restaurant
        @PostMapping("/restaurants/{restaurantId}/reservations/time-range")
        @Operation(summary = "Get reservations by restaurant and time range", description = "Users can view reservations for a specific restaurant within a time range")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Reservations retrieved successfully"),
                        @ApiResponse(responseCode = "403", description = "Access denied")
        })
        public ResponseEntity<List<ReservationResponseDTO>> getReservationsByRestaurantAndTimeRange(
                        @PathVariable String restaurantId,
                        @RequestBody ReservationTimeRangeDTO dto) {
                List<Reservation> reservations = reservationService
                                .findByRestaurantAndTimeRange(restaurantId, dto.getTimeStart(), dto.getTimeEnd());
                List<ReservationResponseDTO> response = reservations.stream()
                                .map(res -> new ReservationResponseDTO(
                                                res.getId(),
                                                res.getUser().getEmail(),
                                                res.getRestaurant().getId(),
                                                res.getDateTime(),
                                                res.getPartySize(),
                                                res.getStatus()))
                                .toList();
                return ResponseEntity.ok(response);
        }
}
