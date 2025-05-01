package com.example.server.service;

import com.example.server.dto.review.ReviewRequestDTO;
import com.example.server.dto.review.ReviewRespondDTO;
import com.example.server.entity.Reservation;
import com.example.server.entity.ReservationStatus;
import com.example.server.entity.Restaurant;
import com.example.server.entity.Review;
import com.example.server.entity.UserInfo;
import com.example.server.repository.ReservationRepository;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.ReviewRepository;
import com.example.server.repository.UserInfoRepository;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ReservationRepository reservationRepository;

    // Create Review
    public Review createReview(String userId, String restaurantId, int rating, String comment) {
        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Reservation reservation = reservationRepository.findTopByUser_IdAndRestaurant_IdAndStatusOrderByDateTimeDesc(
                userId, restaurantId, ReservationStatus.COMPLETED)
                .orElseThrow(() -> new RuntimeException("No completed reservation found for review"));

        if (reviewRepository.existsByReservation_IdAndUser_Id(reservation.getId(), userId)) {
            throw new RuntimeException("You have already reviewed this reservation");
        }


        Review review = new Review();
        review.setUser(user);
        review.setRestaurant(restaurant);
        review.setReservation(reservation);
        review.setRating(rating);
        review.setComment(comment);

        Review savedReview = reviewRepository.save(review);

        // Update rating after create
        updateRestaurantRating(restaurant);

        return savedReview;
    }

    // Get all reviews by restaurant
    public List<ReviewRespondDTO> getReviewsByRestaurant(String restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurant_Id(restaurantId);
        return reviews.stream()
                .map(r -> new ReviewRespondDTO(
                        r.getUser().getEmail(),
                        r.getRating(),
                        r.getComment(),
                        r.getCreatedAt(),
                        r.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    // Get all reviews by user
    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUser_Id(userId);
    }

    // Update Review
    public Review updateReview(String userId, String restaurantId, String reviewId, ReviewRequestDTO dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId) || !review.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Unauthorized to edit this review");
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        Review updated = reviewRepository.save(review);

        // Update rating after update
        updateRestaurantRating(review.getRestaurant());

        return updated;
    }

    // Delete Review
    public void deleteReview(String userId, String restaurantId, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId) || !review.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);

        // Update rating after delete
        updateRestaurantRating(review.getRestaurant());
    }

    // Update restaurant rating using aggregation
    private void updateRestaurantRating(Restaurant restaurant) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("restaurant.$id").is(new ObjectId(restaurant.getId()))),
                Aggregation.group("restaurant")
                        .count().as("totalReviews")
                        .avg("rating").as("averageRating"));

        AggregationResults<Document> result = mongoTemplate.aggregate(agg, "reviews", Document.class);
        Document doc = result.getUniqueMappedResult();

        if (doc != null) {
            int totalReviews = doc.getInteger("totalReviews", 0);
            double averageRating = doc.getDouble("averageRating");
            restaurant.setTotalReviews(totalReviews);
            restaurant.setAverageRating(averageRating);
        } else {
            restaurant.setTotalReviews(0);
            restaurant.setAverageRating(0);
        }

        restaurantRepository.save(restaurant);
    }

}
