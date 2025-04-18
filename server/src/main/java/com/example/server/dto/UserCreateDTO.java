package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {
    @NotBlank(message = "Email cannot be blanked")
    private String email;
    @NotBlank(message = "Password cannot be blanked")
    private String password;
    @NotBlank(message = "Phone cannot be blanked")
    private String phone;
    private Set<String> roles;
}
