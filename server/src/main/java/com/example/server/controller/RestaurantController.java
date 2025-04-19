package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO;
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

    @GetMapping("/me")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<List<Restaurant>> getRestaurantByUser(@AuthenticationPrincipal UserInfoUserDetails userDetails) {
        List<Restaurant> restaurant = restaurantService.getRestaurantByOwner(userDetails.getUserInfo());
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/{id}/availability")
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
    public ResponseEntity<Restaurant> createRestaurant(
            @Valid @ModelAttribute RestaurantCreateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String id,
                                              @Valid @ModelAttribute RestaurantUpdateDTO dto,
                                              @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        Restaurant updatedRestaurant = restaurantService
                .updateRestaurant(id, dto, userDetails.getUserInfo());
        return ResponseEntity.status(HttpStatus.OK).body(updatedRestaurant);
    }


}
