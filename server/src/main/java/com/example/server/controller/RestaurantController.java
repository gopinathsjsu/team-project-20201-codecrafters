package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllApprovedRestaurants();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine) {
        List<Restaurant> result = restaurantService.search(name, state, city, cuisine);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurant(@PathVariable String id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> createRestaurant(
            @Valid @RequestBody RestaurantCreateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> updateRestaurant(@PathVariable String id,
                                              @Valid @RequestBody RestaurantUpdateDTO dto,
                                              @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant updatedRestaurant = restaurantService
                .updateRestaurant(id, dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.OK).body(updatedRestaurant);
    }
}
