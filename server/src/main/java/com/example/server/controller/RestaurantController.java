package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import com.example.server.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
        Optional<Restaurant> restaurantOptional = restaurantService.getRestaurantById(id);
        if (restaurantOptional.isPresent()) {
            return new ResponseEntity<>(restaurantOptional.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> createRestaurant(@Valid @RequestBody RestaurantCreateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        try {
            UserInfo user = userDetails.getUserInfo();
            dto.setUserInfo(user);
            Restaurant createdRestaurant = restaurantService.createRestaurant(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT_MANAGER')")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @Valid @RequestBody RestaurantUpdateDTO dto,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        try {
            UserInfo user = userDetails.getUserInfo();
            if (!user.getId().equals(dto.getUserInfo().getId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
            Restaurant createdRestaurant = restaurantService.updateRestaurant(id, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
