package com.example.server.service;

import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

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

    public void deleteRestaurant(String id) {
        restaurantRepository.deleteById(id);
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
