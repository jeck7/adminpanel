package com.example.adminpanel.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String role;
} 