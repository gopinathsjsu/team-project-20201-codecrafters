package com.example.server.service;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.entity.RefreshToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, RefreshTokenService refreshTokenService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    public JwtResponse authenticate(AuthRequest authRequest) {
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
}
