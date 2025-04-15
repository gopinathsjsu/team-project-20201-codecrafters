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
import com.example.server.entity.Restaurant;
import com.example.server.service.RestaurantService;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminController {
    @Autowired
    private RestaurantService restaurantService;

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteRestaurants(
            @RequestBody List<String> ids,
            @AuthenticationPrincipal UserInfoUserDetails userDetails) {
        restaurantService.deleteRestaurantsAndRelatedData(ids);
        return ResponseEntity.ok("Deleted successfully " + ids.size() + " restaurant(s).");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Restaurant>> getRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllNotApprovedRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @PutMapping("/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Restaurant>> approveRestaurant(@RequestBody List<String> ids,
            @RequestParam boolean approved) {
        List<Restaurant> restaurant = restaurantService.approveRestaurants(ids, approved);
        return ResponseEntity.ok(restaurant);
    }

}
