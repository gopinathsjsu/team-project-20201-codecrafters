package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.reservation.ReservationResponseDTO;
import com.example.server.entity.Restaurant;
import com.example.server.service.ReservationService;
import com.example.server.service.RestaurantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminController {
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private ReservationService reservationService;

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete restaurants", description = "Requires role: ADMIN")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deleted restaurants"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<String> deleteRestaurants(
            @RequestBody List<String> ids,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        restaurantService.deleteRestaurantsAndRelatedData(ids);
        return ResponseEntity.ok("Deleted successfully " + ids.size() + " restaurant(s).");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all not approved restaurants", description = "Requires role: ADMIN")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved restaurants"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<Restaurant>> getRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllNotApprovedRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @PutMapping("/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve or disapprove restaurants", description = "Requires role: ADMIN")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully approved/disapproved restaurants"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<Restaurant>> approveRestaurant(@RequestBody List<String> ids,
            @RequestParam boolean approved) {
        List<Restaurant> restaurant = restaurantService.approveRestaurants(ids, approved);
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/reservations")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all reservations", description = "Admin can monitor all reservations in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fetched Reservations successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<ReservationResponseDTO>> getReservations() {
        return ResponseEntity.ok(reservationService.findAll());
    }

}
