package com.example.adminpanel.service;

import com.example.adminpanel.dto.AuthRequest;
import com.example.adminpanel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        var user = repo.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        return jwtService.generateToken(user);
    }
}
