package com.example.server.service;

import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import com.example.server.exception.BadRequestException;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.UserInfoRepository;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;

import java.util.List;

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

    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Id: " + id + " not found"));
    }

    public Restaurant createRestaurant(RestaurantCreateDTO dto, UserInfo userInfo) {
        if (!userInfo.getRoles().contains("RESTAURANT_MANAGER")) {
            throw new BadRequestException("Username: " + userInfo.getUsername() + " is not a Restaurant Manager");
        }

        if (restaurantRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Restaurant with this name already exists.");
        }

        Restaurant restaurant = getRestaurant(dto, userInfo);

        return restaurantRepository.save(restaurant);
    }

    private static Restaurant getRestaurant(RestaurantCreateDTO dto, UserInfo userInfo) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setCity(dto.getCity());
        restaurant.setState(dto.getState());
        restaurant.setZip(dto.getZip());
        restaurant.setPhone(dto.getPhone());
        restaurant.setEmail(dto.getEmail());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setCapacity(dto.getCapacity());
        restaurant.setCostRating(dto.getCostRating());
        restaurant.setHours(dto.getHours());
        restaurant.setUserInfo(userInfo);
        restaurant.setAverageRating(0.0);
        restaurant.setTotalReviews(0);
        restaurant.setApproved(false);
        return restaurant;
    }

    public Restaurant updateRestaurant(String id, RestaurantUpdateDTO dto, UserInfo userInfo) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Id: " + id + " not found"));

        if (!restaurant.getUserInfo().getId().equals(userInfo.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to update this restaurant");
        }

        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setAddress(dto.getAddress());
        restaurant.setCity(dto.getCity());
        restaurant.setState(dto.getState());
        restaurant.setZip(dto.getZip());
        restaurant.setPhone(dto.getPhone());
        restaurant.setEmail(dto.getEmail());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setCapacity(dto.getCapacity());
        restaurant.setAverageRating(dto.getAverageRating());
        restaurant.setCostRating(dto.getCostRating());
        restaurant.setHours(dto.getHours());
        restaurant.setTotalReviews(dto.getTotalReviews());

        return restaurantRepository.save(restaurant);
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
