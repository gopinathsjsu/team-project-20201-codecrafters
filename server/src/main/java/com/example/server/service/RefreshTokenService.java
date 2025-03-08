package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.entity.RefreshToken;
import com.example.server.repository.RefreshTokenRepository;
import com.example.server.repository.UserInfoRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;

    public RefreshToken createRefreshToken(String username) {
        RefreshToken refreshToken = RefreshToken.builder()
                .userInfo(userInfoRepository.findByUsername(username).get())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(60000000))//10
                .build();
        return refreshTokenRepository.save(refreshToken);
    }


    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }


    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

}
