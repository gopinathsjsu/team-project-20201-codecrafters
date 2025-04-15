package com.example.server.service;

import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO;
import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO.ReservationTime;
import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Reservation;
import com.example.server.entity.Restaurant;
import com.example.server.entity.UserInfo;
import com.example.server.exception.BadRequestException;
import com.example.server.exception.ResourceNotFoundException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repository.ReservationRepository;
import com.example.server.repository.RestaurantRepository;
import com.example.server.repository.ReviewRepository;

import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, ReviewRepository reviewRepository, ReservationRepository reservationRepository) {
        this.restaurantRepository = restaurantRepository;
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<Restaurant> getAllRestaurant() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> getAllApprovedRestaurants() {
        return restaurantRepository.findByApprovedTrue();
    }

    public List<Restaurant> getAllNotApprovedRestaurants() {
        return restaurantRepository.findByApprovedFalse();
    }

    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant Id: " + id + " not found"));
    }

    public Restaurant createRestaurant(RestaurantCreateDTO dto, UserInfo userInfo) {
        if (!userInfo.getRoles().contains("RESTAURANT_MANAGER")) {
            throw new BadRequestException("Username: " + userInfo.getEmail() + " is not a Restaurant Manager");
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
        restaurant.setHours(dto.getHours());
        restaurant.setTotalReviews(dto.getTotalReviews());

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

    public List<Restaurant> approveRestaurants(List<String> restaurantIds, boolean approved) {
        List<Restaurant> restaurants = restaurantRepository.findAllById(restaurantIds);
        if (restaurants.isEmpty()) {
            throw new IllegalArgumentException("Restaurants not found");
        }
        for (Restaurant restaurant : restaurants) {
            restaurant.setApproved(approved);
        }
        return restaurantRepository.saveAll(restaurants);
    }
    

    public List<Restaurant> search(String name, String state, String city, String cuisine) {
        return restaurantRepository
                .findByNameContainingIgnoreCaseAndStateContainingIgnoreCaseAndCityContainingIgnoreCaseAndCuisineContainingIgnoreCaseAndApproved(
                        name != null ? name : "",
                        state != null ? state : "",
                        city != null ? city : "",
                        cuisine != null ? cuisine : "", true);
    }

    public RestaurantAndAvailableSeatDTO getAvailableSeatsByTime(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));

        LocalDateTime now = LocalDateTime.now();

        List<Reservation> reservations =
                reservationRepository.findAllByRestaurant_IdAndDateTimeAfterOrderByDateTimeAsc(restaurantId, now);

        Map<LocalDateTime, List<Reservation>> groupedByTime =
                reservations.stream().collect(Collectors.groupingBy(Reservation::getDateTime));

        List<ReservationTime> reservationTimes = new ArrayList<>();

        for (Map.Entry<LocalDateTime, List<Reservation>> entry : groupedByTime.entrySet()) {
            int totalReserved = entry.getValue().stream()
                    .mapToInt(Reservation::getPartySize)
                    .sum();
            int available = restaurant.getCapacity() - totalReserved;
            reservationTimes.add(new ReservationTime(
                    Math.max(available, 0), 
                    entry.getKey() 
            ));
        }
        reservationTimes.sort(Comparator.comparing(ReservationTime::getDateTime));
        return new RestaurantAndAvailableSeatDTO(restaurant, reservationTimes);
    }

}
