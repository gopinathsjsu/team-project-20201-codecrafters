package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entity.UserInfo;

@Repository
public interface UserInfoRepository extends MongoRepository<UserInfo, String> {

    Optional<UserInfo> findByEmail(String email);
}
