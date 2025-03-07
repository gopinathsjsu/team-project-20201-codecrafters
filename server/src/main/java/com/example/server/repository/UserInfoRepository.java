package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.UserInfo;

public interface UserInfoRepository extends MongoRepository<UserInfo, String> {

    Optional<UserInfo> findByUsername(String username);

}
