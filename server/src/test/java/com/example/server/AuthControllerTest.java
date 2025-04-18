package com.example.server;

import com.example.server.entity.UserInfo;
import com.example.server.repository.UserInfoRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserInfo userInfo = new UserInfo();

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection(UserInfo.class);

        userInfo.setEmail("admin@example.com");
        userInfo.setPassword(passwordEncoder.encode("password"));
        userInfo.setPhone("123-456-7890");
        userInfo.setRoles(new HashSet<>());
        userInfo.getRoles().add("ADMIN");
        userInfo.getRoles().add("USER");
        userInfo.getRoles().add("RESTAURANT_MANAGER");

        mongoTemplate.insert(userInfo);
    }

    @Test
    public void loginSuccess() throws Exception {
        String json = """
                {
                    "email": "admin@example.com",
                    "password": "password"
                }
                """;
        MvcResult result = mvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertEquals(userInfo.getEmail(), JsonPath.read(response, "$.email"));
    }

    @Test
    public void loginFailed() throws Exception {
        String json = """
                {
                    "email": "admin@example.com",
                    "password": "123"
                }
                """;

        mvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void registerSuccess() throws Exception {
        String json = """
                {
                    "email": "test@example.com",
                    "password": "123",
                    "phone": "123-456-7890",
                    "roles": [
                        "USER"
                    ]
                }
                """;

        MvcResult result = mvc.perform(post("/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertEquals("User created successfully", response);
    }

    @Test
    public void registerFailed() throws Exception {
        String json = """
                {
                    "email": "test@example.com",
                    "password": "",
                    "phone": "123-456-7890",
                    "roles": [
                        "USER"
                    ]
                }
                """;

        mvc.perform(post("/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void duplicateEmail() throws Exception {
        String json = """
                {
                    "email": "admin@example.com",
                    "password": "123",
                    "phone": "123-456-7890",
                    "roles": [
                        "USER"
                    ]
                }
                """;

        mvc.perform(post("/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().is4xxClientError());
    }
}
