package com.example.server.service;

import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.repository.ReservationRepository;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.ReviewRepository;

import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    public List<Restaurant> getAllRestaurant() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> getAllApprovedRestaurants() {
        return restaurantRepository.findByApprovedTrue();
    }

    public Optional<Restaurant> getRestaurantById(String id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant createRestaurant(RestaurantCreateDTO dto) {
        if (restaurantRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Restaurant with this name already exists.");
        }

        Restaurant restaurant = new Restaurant();

        // Copy simple fields
        BeanUtils.copyProperties(dto, restaurant, "hours");

        // Manually set hours and bookingHours
        restaurant.setHours(dto.getHours());
        // restaurant.setBookingHours(dto.getBookingHours());

        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(String id, RestaurantUpdateDTO dto) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    BeanUtils.copyProperties(dto, restaurant);
                    return restaurantRepository.save(restaurant);
                })
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
    }

    public void deleteRestaurantsAndRelatedData(List<String> restaurantIds) {
        List<ObjectId> objectIds = restaurantIds.stream()
                .map(ObjectId::new)
                .toList();
        reservationRepository.deleteAllByRestaurantIds(objectIds);
        reviewRepository.deleteAllByRestaurantIds(objectIds);
        restaurantRepository.deleteAllById(restaurantIds);
    }

    public Restaurant approveRestaurant(String restaurantId, boolean approved) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        restaurant.setApproved(approved);
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> search(String name, String state, String city, String cuisine) {
        return restaurantRepository
                .findByNameContainingIgnoreCaseAndStateContainingIgnoreCaseAndCityContainingIgnoreCaseAndCuisineContainingIgnoreCase(
                        name != null ? name : "",
                        state != null ? state : "",
                        city != null ? city : "",
                        cuisine != null ? cuisine : "");
    }

}
