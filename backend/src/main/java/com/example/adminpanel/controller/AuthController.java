package com.example.adminpanel.controller;

import com.example.adminpanel.dto.AuthRequest;
import com.example.adminpanel.dto.AuthResponse;
import com.example.adminpanel.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = service.login(request);
        return new AuthResponse(token);
    }
}
