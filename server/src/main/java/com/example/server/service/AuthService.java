package com.example.server.service;

import com.example.server.dto.AuthRequest;
import com.example.server.dto.JwtResponse;
import com.example.server.entity.RefreshToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequest.getEmail());
                String accessToken = jwtService.generateToken(authRequest.getEmail());
                return new JwtResponse(authRequest.getEmail(), accessToken, refreshToken.getToken(), refreshToken.getUserInfo().getRoles());
            } else {
            throw new BadCredentialsException("Invalid user credentials!");
            }
        } catch (Exception e) {
            System.out.println("Authentication exception: " + e.getMessage());
            throw new BadCredentialsException("Invalid user credentials!");
        }
    }
}
