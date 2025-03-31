package com.example.server.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByRestaurant_Id(String restaurantId);

    List<Review> findByUser_Id(String userId);

}
