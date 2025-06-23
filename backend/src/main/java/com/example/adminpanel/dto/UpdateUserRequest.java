package com.example.adminpanel.dto;

import com.example.adminpanel.entity.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstname;
    private String lastname;
    private Role role;
} 