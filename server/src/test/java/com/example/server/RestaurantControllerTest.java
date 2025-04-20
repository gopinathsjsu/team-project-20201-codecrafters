package com.example.server;

import com.example.server.entity.Restaurant;
import com.example.server.entity.TimeInterval;
import com.example.server.entity.UserInfo;
import com.example.server.service.RestaurantService;
import com.jayway.jsonpath.JsonPath;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RestaurantControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestaurantService restaurantService;

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection(UserInfo.class);
        mongoTemplate.dropCollection(Restaurant.class);
        mongoTemplate.insert(createUserByEmailAndRole("admin@example.com", "RESTAURANT_MANAGER"));
        mongoTemplate.insert(createUserByEmailAndRole("admin1@example.com", "RESTAURANT_MANAGER"));
        mongoTemplate.insert(createUserByEmailAndRole("test@example.com", "USER"));

        Map<DayOfWeek, TimeInterval> hours1 = Map.of(
                DayOfWeek.MONDAY, new TimeInterval("11:00", "22:00"),
                DayOfWeek.TUESDAY, new TimeInterval("11:00", "22:00")
        );

        Map<DayOfWeek, TimeInterval> hours2 = Map.of(
                DayOfWeek.FRIDAY, new TimeInterval("12:00", "23:00"),
                DayOfWeek.SATURDAY, new TimeInterval("12:00", "23:00")
        );

        Restaurant r1 = new Restaurant(
                null,
                "1",
                "Mama's Italian Kitchen",
                "Cozy Italian spot with homemade pasta and wine.",
                "123 Olive Street",
                "New York",
                "NY",
                "10001",
                "(123) 456-7890",
                "mama@italiankitchen.com",
                "Italian",
                50,
                4.5,
                120,
                hours1,
                true,
                List.of("https://example.com/image1.jpg", "https://example.com/image2.jpg"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        Restaurant r2 = new Restaurant(
                null,
                "2",
                "Sakura Sushi",
                "Modern sushi bar with fresh sashimi and sake.",
                "456 Cherry Blossom Ave",
                "San Francisco",
                "CA",
                "94102",
                "(987) 654-3210",
                "info@sakurasushi.com",
                "Japanese",
                40,
                4.8,
                200,
                hours2,
                true,
                List.of("https://example.com/sushi1.jpg"),
                LocalDateTime.now(),
                LocalDateTime.now()
        );

        mongoTemplate.save(r1);
        mongoTemplate.save(r2);
    }

    @Test
    public void allRestaurantsMustBeApproved() throws Exception {
        mvc.perform(get("/api/restaurants")) // Adjust the base path if needed
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].approved").value(
                        Matchers.everyItem(Matchers.is(true))
                ));
    }

    @Test
    public void managerCanCreateRestaurant() throws Exception {
        String token = getToken("admin@example.com", "password");
        assertNotNull(token);

        String response = createRestaurantResponse(token);
        assertNotNull(JsonPath.read(response, "$.id"));

        Boolean approved = JsonPath.read(response, "$.approved");
        assertFalse(approved);
    }

    @Test
    public void managerCanUpdateRestaurant() throws Exception {
        String token = getToken("admin@example.com", "password");
        assertNotNull(token);

        String response = createRestaurantResponse(token);
        String restaurantId = JsonPath.read(response, "$.id");
        assertNotNull(restaurantId);

        response = updateRestaurantResponse(restaurantId, token);
        assertEquals("Sushi Town", JsonPath.read(response, "$.name"));
    }

    @Test
    public void otherUsersCannotCreateRestaurant() throws Exception {
        String token = getToken("test@example.com", "password");
        assertNotNull(token);

        MockMultipartFile image = new MockMultipartFile(
                "images",                     // field name
                "restaurant.jpg",                   // original filename
                "image/jpeg",                       // content type
                Files.readAllBytes(Paths.get("src/test/resources/img.jpg"))          // fake image content
        );


        mvc.perform(multipart("/api/restaurants")
                        .file(image)
                        .header("Authorization", "Bearer " + token)
                        .param("name", "Gourmet Garden")
                        .param("description", "A cozy place offering fresh, locally-sourced meals with a twist.")
                        .param("address", "123 Foodie Lane")
                        .param("city", "Flavor Town")
                        .param("state", "CA")
                        .param("zip", "90001")
                        .param("phone", "123-456-7890")
                        .param("email", "contact@gourmetgarden.com")
                        .param("cuisine", "Farm-to-Table")
                        .param("capacity", "50")
                        .param("hours[MONDAY].start", "10:00")
                        .param("hours[MONDAY].end", "22:00")
                        .param("hours[TUESDAY].start", "10:00")
                        .param("hours[TUESDAY].end", "22:00"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void onlyManagerCanUpdateTheirRestaurant() throws Exception {
        String token = getToken("admin1@example.com", "password");
        assertNotNull(token);

        String response = createRestaurantResponse(token);
        String restaurantId = JsonPath.read(response, "$.id");
        assertNotNull(restaurantId);

        token = getToken("admin@example.com", "password");
        String finalToken = token;
        mvc.perform(multipart("/api/restaurants/" + restaurantId)
                        .param("name", "Sushi Town")
                        .param("description", "A cozy place offering fresh, locally-sourced meals with a twist.")
                        .param("address", "123 Foodie Lane")
                        .param("city", "Flavor Town")
                        .param("state", "CA")
                        .param("zip", "90001")
                        .param("phone", "123-456-7890")
                        .param("email", "contact@gourmetgarden.com")
                        .param("cuisine", "Farm-to-Table")
                        .param("capacity", "50")
                        .param("hours[MONDAY].start", "10:00")
                        .param("hours[MONDAY].end", "22:00")
                        .param("hours[TUESDAY].start", "10:00")
                        .param("hours[TUESDAY].end", "22:00")
                        .with(request -> {
                            request.setMethod("PUT");  // 👈 Force it to be PUT
                            request.addHeader("Authorization", "Bearer  " + finalToken);
                            return request;
                        }))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void validRestaurantCanBeFetched() throws Exception {
        MvcResult result = mvc.perform(get("/api/restaurants")) // Adjust the base path if needed
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        String restaurantId = JsonPath.read(response, "$[0].id");

        result = mvc.perform(get("/api/restaurants/" + restaurantId))
                .andExpect(status().isOk())
                .andReturn();

        response = result.getResponse().getContentAsString();
        assertNotNull(response);
    }

    @Test
    public void searchRestaurantReturnAtLeastOne() throws Exception {
        mvc.perform(get("/api/restaurants/search?name=Sushi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Sakura Sushi"));
    }

    @Test
    public void searchRestaurantReturnEmpty() throws Exception {
        mvc.perform(get("/api/restaurants/search?name=x"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void getReviewsFromRestaurant() throws Exception {
        MvcResult result = mvc.perform(get("/api/restaurants")) // Adjust the base path if needed
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        String restaurantId = JsonPath.read(response, "$[0].id");
        System.out.println(restaurantId);

        mvc.perform(get("/api/restaurants/" + restaurantId + "/reviews"))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void getReservationsFromRestaurant() throws Exception {
        String token = getToken("admin@example.com", "password");
        assertNotNull(token);

        String response = createRestaurantResponse(token);
        String restaurantId = JsonPath.read(response, "$.id");
        assertNotNull(restaurantId);

        mvc.perform(get("/api/restaurants/" + restaurantId + "/reservations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    public void onlyOwnerCanSeeTheirOwnReservations() throws Exception {
        String token = getToken("admin@example.com", "password");
        assertNotNull(token);

        String response = createRestaurantResponse(token);
        String restaurantId = JsonPath.read(response, "$.id");
        assertNotNull(restaurantId);

        token = getToken("admin1@example.com", "password");
        assertNotNull(token);

        mvc.perform(get("/api/restaurants/" + restaurantId + "/reservations")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().is4xxClientError());
    }

    private String createRestaurantResponse(String token) throws Exception {

        MockMultipartFile image = new MockMultipartFile(
                "images",                     // field name
                "restaurant.jpg",                   // original filename
                "image/jpeg",                       // content type
                Files.readAllBytes(Paths.get("src/test/resources/img.jpg"))          // fake image content
        );


        MvcResult result = mvc.perform(multipart("/api/restaurants")
                        .file(image)
                        .header("Authorization", "Bearer " + token)
                        .param("name", "Gourmet Garden")
                        .param("description", "A cozy place offering fresh, locally-sourced meals with a twist.")
                        .param("address", "123 Foodie Lane")
                        .param("city", "Flavor Town")
                        .param("state", "CA")
                        .param("zip", "90001")
                        .param("phone", "123-456-7890")
                        .param("email", "contact@gourmetgarden.com")
                        .param("cuisine", "Farm-to-Table")
                        .param("capacity", "50")
                        .param("hours[MONDAY].start", "10:00")
                        .param("hours[MONDAY].end", "22:00")
                        .param("hours[TUESDAY].start", "10:00")
                        .param("hours[TUESDAY].end", "22:00"))
                .andExpect(status().isCreated())
                .andReturn();

        return result.getResponse().getContentAsString();
    }

    private String updateRestaurantResponse(String id, String token) throws Exception {
        MvcResult result = mvc.perform(multipart("/api/restaurants/" + id)
                        .param("name", "Sushi Town")
                        .param("description", "A cozy place offering fresh, locally-sourced meals with a twist.")
                        .param("address", "123 Foodie Lane")
                        .param("city", "Flavor Town")
                        .param("state", "CA")
                        .param("zip", "90001")
                        .param("phone", "123-456-7890")
                        .param("email", "contact@gourmetgarden.com")
                        .param("cuisine", "Farm-to-Table")
                        .param("capacity", "50")
                        .param("hours[MONDAY].start", "10:00")
                        .param("hours[MONDAY].end", "22:00")
                        .param("hours[TUESDAY].start", "10:00")
                        .param("hours[TUESDAY].end", "22:00")
                        .with(request -> {
                            request.setMethod("PUT");  // 👈 Force it to be PUT
                            request.addHeader("Authorization", "Bearer  " + token);
                            return request;
                        }))
                .andExpect(status().isOk())
                .andReturn();

        return result.getResponse().getContentAsString();
    }

    private String getToken(String email, String password) throws Exception {
        String json = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";

        MvcResult result = mvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        return JsonPath.read(response, "$.accessToken");
    }

    private UserInfo createUserByEmailAndRole(String email, String role) {
        UserInfo user = new UserInfo();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password"));
        user.setPhone("123-456-7890");
        user.setRoles(new HashSet<>());
        user.getRoles().add(role);
        return user;
    }
}
