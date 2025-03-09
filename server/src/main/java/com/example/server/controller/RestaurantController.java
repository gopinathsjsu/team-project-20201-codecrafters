package com.example.server.controller;

import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurant();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurant(@PathVariable String id) {
        Optional<Restaurant> restaurantOptional = restaurantService.getRestaurantById(id);
        if (restaurantOptional.isPresent()) {
            return new ResponseEntity<>(restaurantOptional.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    @PreAuthorize("hasRole('RestaurantManager')")
    public ResponseEntity<?> createRestaurant(@Valid @RequestBody RestaurantCreateDTO dto, Authentication authentication) {
        try {
            String username = authentication.getName();
            dto.setUsername(username);
            Restaurant createdRestaurant = restaurantService.createRestaurant(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RestaurantManager')")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @Valid @RequestBody RestaurantUpdateDTO dto,
            Authentication authentication
    ) {
        try {
            String username = authentication.getName();
            if (!username.equals(dto.getUsername())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            Restaurant createdRestaurant = restaurantService.updateRestaurant(id, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseEntity<?> deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
