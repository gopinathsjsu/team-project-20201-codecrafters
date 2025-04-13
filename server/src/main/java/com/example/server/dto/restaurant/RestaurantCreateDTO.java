package com.example.server.dto.restaurant;

import com.example.server.entity.TimeInterval;
import com.example.server.entity.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.DayOfWeek;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCreateDTO {
    private String name;
    @DBRef
    private UserInfo userInfo;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zip;
    private String phone;
    private String email;
    private String cuisine;
    private int capacity;
    private Map<DayOfWeek, TimeInterval> hours; // open hours

    //private Map<DayOfWeek, List<TimeInterval>> bookingHours; // multiple booking slots

}
