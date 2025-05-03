package com.example.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.dto.review.ReviewRequestDTO;
import com.example.server.entity.Review;
import com.example.server.entity.UserInfo;
import com.example.server.config.UserInfoUserDetails;
import com.example.server.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Create Review
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Create a review", description = "Allows a user to create a review for a restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid rating value"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<?> createReview(@AuthenticationPrincipal UserInfoUserDetails userDetails,
            @PathVariable String restaurantId,
            @RequestBody ReviewRequestDTO dto) {
        UserInfo user = userDetails.getUserInfo();

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        reviewService.createReview(user.getId(), restaurantId, dto.getRating(), dto.getComment());
        return ResponseEntity.status(201)
                .body("Review created successfully for restaurant with ID: " + restaurantId);
    }

    // Get all reviews
    @GetMapping
    @Operation(summary = "Get all reviews for a restaurant", description = "Retrieve all reviews for a given restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Restaurant not found")
    })
    public ResponseEntity<?> getReviews(@PathVariable String restaurantId) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurant(restaurantId));
    }

    // Update review
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Update a review", description = "Allows a user to update their review for a restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review updated successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<?> updateReview(@AuthenticationPrincipal UserInfoUserDetails userDetails,
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @RequestBody ReviewRequestDTO dto) {
        UserInfo user = userDetails.getUserInfo();
        Review updatedReview = reviewService.updateReview(user.getId(), restaurantId, reviewId, dto);
        return ResponseEntity.ok(updatedReview);
    }

    // Delete review
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    @Operation(summary = "Delete a review", description = "Allows a user to delete their review for a restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<?> deleteReview(@AuthenticationPrincipal UserInfoUserDetails userDetails,
            @PathVariable String restaurantId,
            @PathVariable String reviewId) {
        UserInfo user = userDetails.getUserInfo();
        reviewService.deleteReview(user.getId(), restaurantId, reviewId);
        return ResponseEntity.noContent().build();
    }
}
