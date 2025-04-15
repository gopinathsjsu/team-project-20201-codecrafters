package com.example.server.controller;

import com.example.server.dto.UserCreateDTO;
import com.example.server.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.dto.RefreshTokenRequest;
import com.example.server.entity.RefreshToken;
import com.example.server.service.JwtService;
import com.example.server.service.RefreshTokenService;
import com.example.server.service.UserService;

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
    public ResponseEntity<?> addNewUser(@RequestBody UserCreateDTO user) {
        System.out.println("user: " + user);
        return ResponseEntity.ok(service.addUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        JwtResponse token = authService.authenticate(authRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token!"));

        refreshTokenService.verifyExpiration(refreshToken);
        String accessToken = jwtService.generateToken(refreshToken.getUserInfo().getEmail());
        return  ResponseEntity.ok(new JwtResponse(refreshToken.getUserInfo().getEmail(), accessToken, refreshToken.getToken(), refreshToken.getUserInfo().getRoles()));
    }

}
