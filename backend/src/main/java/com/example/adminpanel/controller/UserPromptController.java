package com.example.adminpanel.controller;

import com.example.adminpanel.entity.UserPrompt;
import com.example.adminpanel.service.UserPromptService;
import com.example.adminpanel.dto.CreateUserPromptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-prompts")
public class UserPromptController {

    @Autowired
    private UserPromptService userPromptService;

    @PostMapping
    public ResponseEntity<UserPrompt> createUserPrompt(
            Authentication authentication,
            @RequestBody CreateUserPromptRequest request) {
        String userEmail = authentication.getName();
        UserPrompt userPrompt = userPromptService.createUserPrompt(userEmail, request);
        return ResponseEntity.ok(userPrompt);
    }

    @GetMapping
    public ResponseEntity<List<UserPrompt>> getUserPrompts(Authentication authentication) {
        String userEmail = authentication.getName();
        List<UserPrompt> prompts = userPromptService.getUserPrompts(userEmail);
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<UserPrompt>> getUserFavorites(Authentication authentication) {
        String userEmail = authentication.getName();
        List<UserPrompt> favorites = userPromptService.getUserFavorites(userEmail);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<UserPrompt>> getUserPromptsByCategory(
            Authentication authentication,
            @PathVariable String category) {
        String userEmail = authentication.getName();
        List<UserPrompt> prompts = userPromptService.getUserPromptsByCategory(userEmail, category);
        return ResponseEntity.ok(prompts);
    }

    @PutMapping("/{promptId}/favorite")
    public ResponseEntity<UserPrompt> toggleFavorite(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        UserPrompt userPrompt = userPromptService.toggleFavorite(userEmail, promptId);
        return ResponseEntity.ok(userPrompt);
    }

    @PutMapping("/{promptId}/increment-usage")
    public ResponseEntity<UserPrompt> incrementUsage(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        UserPrompt userPrompt = userPromptService.incrementUsage(userEmail, promptId);
        return ResponseEntity.ok(userPrompt);
    }

    @DeleteMapping("/{promptId}")
    public ResponseEntity<Void> deleteUserPrompt(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        userPromptService.deleteUserPrompt(userEmail, promptId);
        return ResponseEntity.ok().build();
    }
} 