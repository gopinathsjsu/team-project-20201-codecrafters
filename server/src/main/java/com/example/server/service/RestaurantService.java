package com.example.server.service;

import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO;
import com.example.server.dto.restaurant.RestaurantAndAvailableSeatDTO.ReservationTime;
import com.example.server.dto.restaurant.RestaurantCreateDTO;
import com.example.server.dto.restaurant.RestaurantUpdateDTO;
import com.example.server.entity.Reservation;
import com.example.server.entity.Restaurant;
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
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<Restaurant> getAllNotApprovedRestaurants() {
        return restaurantRepository.findByApprovedFalse();
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
