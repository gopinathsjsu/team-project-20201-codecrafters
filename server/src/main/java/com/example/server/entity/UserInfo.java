package com.example.server.entity;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")  // Specify the collection name
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {
    @Id
    private String id;
    private String username;
    private String password;
    private Set<String> roles; 

}
