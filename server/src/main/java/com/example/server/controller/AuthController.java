package com.example.server.controller;

import com.example.server.dto.UserCreateDTO;
import com.example.server.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.dto.RefreshTokenRequest;
import com.example.server.entity.RefreshToken;
import com.example.server.service.JwtService;
import com.example.server.service.RefreshTokenService;
import com.example.server.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/")
public class AuthController {

    private final UserService service;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthService authService;

    public AuthController(UserService service,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            AuthService authService) {
        this.service = service;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.authService = authService;
    }

    @PostMapping("/signUp")
        @Operation(summary = "Register new user", description = "Register a new user with email, password, and role")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<String> addNewUser(@Valid @RequestBody UserCreateDTO user) {
        System.out.println("user: " + user);
        return ResponseEntity.ok(service.addUser(user));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Authenticate user credentials and return JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<JwtResponse> authenticateAndGetToken(
            @RequestBody AuthRequest authRequest,
            HttpServletRequest request) {

        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null)
            ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String sessionId = request.getSession().getId();
        String deviceInfo = ipAddress + "_" + userAgent.hashCode() + "_" + sessionId;
        JwtResponse token = authService.authenticate(authRequest, deviceInfo);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/refreshToken")
    @Operation(summary = "Refresh JWT token", description = "Generate a new access token using a valid refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token")
    })
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token!"));

        refreshTokenService.verifyExpiration(refreshToken);
        String accessToken = jwtService.generateToken(refreshToken.getUserInfo().getEmail());
        return ResponseEntity.ok(new JwtResponse(refreshToken.getUserInfo().getEmail(), accessToken,
                refreshToken.getToken(), refreshToken.getUserInfo().getRoles()));
    }

}
