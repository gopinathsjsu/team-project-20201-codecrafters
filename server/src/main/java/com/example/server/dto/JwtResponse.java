package com.example.server.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {

    private String email;
    private String accessToken;  
    private String refreshToken; 
    private Set<String> role;
}