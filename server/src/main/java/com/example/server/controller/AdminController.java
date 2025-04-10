package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.entity.Restaurant;
import com.example.server.service.RestaurantService;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminController {
    @Autowired
    private RestaurantService restaurantService;

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> deleteRestaurants(
            @RequestBody List<String> ids,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        try {
            restaurantService.deleteRestaurantsAndRelatedData(ids);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveRestaurant(@RequestBody List<String> ids, @RequestParam boolean approved) {
        try {
            List<Restaurant> restaurant = restaurantService.approveRestaurants(ids, approved);
            return ResponseEntity.ok(restaurant);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    

}
