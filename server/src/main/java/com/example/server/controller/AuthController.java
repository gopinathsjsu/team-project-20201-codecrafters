package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.dto.RefreshTokenRequest;
import com.example.server.entity.RefreshToken;
import com.example.server.entity.UserInfo;
import com.example.server.service.JwtService;
import com.example.server.service.RefreshTokenService;
import com.example.server.service.UserService;

@RestController
@RequestMapping("/")
public class AuthController {

    @Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

 

    @PostMapping("/signUp")
    public String addNewUser(@RequestBody UserInfo userInfo) {
        return service.addUser(userInfo);
    }

    @PostMapping("/login")
    public JwtResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequest.getUsername());
                String accessToken = jwtService.generateToken(authRequest.getUsername());
                return new JwtResponse(authRequest.getUsername(), accessToken, refreshToken.getToken());
            } else {
                throw new UsernameNotFoundException("Invalid user credentials!");
            }
        } catch (Exception e) {
            System.out.println("Authentication exception: " + e.getMessage());
            throw new UsernameNotFoundException("Invalid user credentials!", e);
        }
    }

    @PostMapping("/refreshToken")
    public JwtResponse refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenRequest.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token!"));

        refreshTokenService.verifyExpiration(refreshToken);
        String accessToken = jwtService.generateToken(refreshToken.getUserInfo().getUsername());

        return new JwtResponse(refreshToken.getUserInfo().getUsername(), accessToken, refreshToken.getToken());
    }

    @GetMapping("/data")
    @PreAuthorize("hasRole('USER')  or hasRole('ADMIN') or hasRole('RESTAURANT_MANAGER')")
    public String getAdminData() {
        return "This is data only for admins!";
    }

   

}
