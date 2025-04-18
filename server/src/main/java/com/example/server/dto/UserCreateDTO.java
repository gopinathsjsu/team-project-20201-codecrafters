package com.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank(message = "Email cannot be blanked")
    @Email
    private String email;

    @NotBlank(message = "Password cannot be blanked")
    @Size(min = 8, message = "{validation.name.size.too_short}")
    @Size(max = 16, message = "{validation.name.size.too_long}")
    private String password;

    @NotBlank(message = "Phone cannot be blanked")
    private String phone;
    private Set<String> roles;
}
