package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.entity.UserInfo;
import com.example.server.repository.UserInfoRepository;

import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(UserInfo userInfo) {
        Optional<UserInfo> existingUser = repository.findByUsername(userInfo.getUsername());
        if (existingUser.isPresent()) {
            return existingUser.get().getUsername() + " already exists!";
        }

        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        repository.save(userInfo);
        return "User added to the system";
    }

    public UserInfo findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User does not exist"));
    }
    
}
