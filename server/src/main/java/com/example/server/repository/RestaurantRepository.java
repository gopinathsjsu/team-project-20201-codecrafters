package com.example.server.repository;

import com.example.server.entity.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    boolean existsByName(String name);
    Optional<Restaurant> findByName(String name);
    List<Restaurant> findAllByUsername(String username);
}
