package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO;
import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.service.RestaurantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    @Operation(summary = "Get all approved restaurants", description = "Retrieve a list of all approved restaurants")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    })
    public List<RestaurantAndAvailableSeatDTO> getAllRestaurants() {
        List<Restaurant> approvedRestaurants = restaurantService.getAllApprovedRestaurants();

        List<RestaurantAndAvailableSeatDTO> result = approvedRestaurants.stream()
                .map(restaurant -> restaurantService.getAvailableSeatsByTime(restaurant.getId()))
                .collect(Collectors.toList());

        return result;
    }

    @GetMapping("/search")
    @Operation(summary = "Search restaurants", description = "Search restaurants by name, state, city, or cuisine")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<?> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine) {
        List<Restaurant> result = restaurantService.search(name, state, city, cuisine);
        List<RestaurantAndAvailableSeatDTO> dtoList = result.stream()
                .map(restaurant -> restaurantService.getAvailableSeatsByTime(restaurant.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant by ID", description = "Retrieve details of a restaurant by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<RestaurantAndAvailableSeatDTO> getRestaurant(@PathVariable String id) {
        try {
            RestaurantAndAvailableSeatDTO dto = restaurantService.getAvailableSeatsByTime(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Get restaurants by owner", description = "Retrieve restaurants managed by the logged-in manager")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurants retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<List<Restaurant>> getRestaurantByUser(
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        List<Restaurant> restaurant = restaurantService.getRestaurantByOwner(userDetails.getUserInfo());
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Check restaurant availability", description = "Get available seats for a specific restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Availability retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<RestaurantAndAvailableSeatDTO> getRestaurantWithAvailability(@PathVariable String id) {
        try {
            RestaurantAndAvailableSeatDTO dto = restaurantService.getAvailableSeatsByTime(id);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Create a new restaurant", description = "Allows a manager to create a new restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Restaurant created successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<Restaurant> createRestaurant(
            @Valid @ModelAttribute RestaurantCreateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Update restaurant details", description = "Allows a manager to update details of a restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Restaurant updated successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String id,
            @Valid @ModelAttribute RestaurantUpdateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant updatedRestaurant = restaurantService
                .updateRestaurant(id, dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.OK).body(updatedRestaurant);
    }
}
