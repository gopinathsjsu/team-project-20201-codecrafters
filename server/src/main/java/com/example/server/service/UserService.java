package com.example.server.service;

import com.example.server.dto.UserCreateDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.entity.UserInfo;
import com.example.server.repository.UserInfoRepository;

@Service
public class UserService {

    private final UserInfoRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserInfoRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public String addUser(UserCreateDTO user) {
        repository.findByUsername(user.getUsername()).ifPresent(u -> {
            throw new RuntimeException(u.getUsername() + " already exists!");
        });

        UserInfo userInfo = new UserInfo();
        BeanUtils.copyProperties(user, userInfo);
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        repository.save(userInfo);

        return "User created successfully";
    }

    public UserInfo findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User does not exist"));
    }
}
