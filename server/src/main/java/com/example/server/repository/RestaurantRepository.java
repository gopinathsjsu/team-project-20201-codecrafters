package com.example.server.repository;

import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    boolean existsByName(String name);
    Optional<Restaurant> findByName(String name);
    List<Restaurant> findRestaurantsByUserInfo(UserInfo userinfo);
    List<Restaurant> findByApprovedFalse();
    List<Restaurant> findByApprovedTrue();
    List<Restaurant> findByNameContainingIgnoreCaseAndStateContainingIgnoreCaseAndCityContainingIgnoreCaseAndCuisineContainingIgnoreCaseAndApproved(
    String name, String state, String city, String cuisine, boolean approved
    );

}
