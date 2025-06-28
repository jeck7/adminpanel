package com.example.adminpanel.controller;

import com.example.adminpanel.entity.SharedPrompt;
import com.example.adminpanel.service.SharedPromptService;
import com.example.adminpanel.dto.CreateSharedPromptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shared-prompts")
public class SharedPromptController {

    @Autowired
    private SharedPromptService sharedPromptService;

    @PostMapping
    public ResponseEntity<SharedPrompt> createSharedPrompt(
            Authentication authentication,
            @RequestBody CreateSharedPromptRequest request) {
        String userEmail = authentication.getName();
        SharedPrompt sharedPrompt = sharedPromptService.createSharedPrompt(userEmail, request);
        return ResponseEntity.ok(sharedPrompt);
    }

    @GetMapping
    public ResponseEntity<List<SharedPrompt>> getPublicPrompts() {
        List<SharedPrompt> prompts = sharedPromptService.getPublicPrompts();
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SharedPrompt>> getPublicPromptsByCategory(
            @PathVariable String category) {
        List<SharedPrompt> prompts = sharedPromptService.getPublicPromptsByCategory(category);
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<SharedPrompt>> getPopularPrompts() {
        List<SharedPrompt> prompts = sharedPromptService.getPopularPrompts();
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/most-used")
    public ResponseEntity<List<SharedPrompt>> getMostUsedPrompts() {
        List<SharedPrompt> prompts = sharedPromptService.getMostUsedPrompts();
        return ResponseEntity.ok(prompts);
    }

    @GetMapping("/my-prompts")
    public ResponseEntity<List<SharedPrompt>> getUserSharedPrompts(Authentication authentication) {
        String userEmail = authentication.getName();
        List<SharedPrompt> prompts = sharedPromptService.getUserSharedPrompts(userEmail);
        return ResponseEntity.ok(prompts);
    }

    @PutMapping("/{promptId}/like")
    public ResponseEntity<SharedPrompt> toggleLike(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        SharedPrompt sharedPrompt = sharedPromptService.toggleLike(userEmail, promptId);
        return ResponseEntity.ok(sharedPrompt);
    }

    @GetMapping("/{promptId}/has-liked")
    public ResponseEntity<Map<String, Boolean>> hasUserLiked(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        boolean hasLiked = sharedPromptService.hasUserLiked(userEmail, promptId);
        return ResponseEntity.ok(Map.of("hasLiked", hasLiked));
    }

    @PutMapping("/{promptId}/increment-usage")
    public ResponseEntity<SharedPrompt> incrementUsage(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        SharedPrompt sharedPrompt = sharedPromptService.incrementUsage(userEmail, promptId);
        return ResponseEntity.ok(sharedPrompt);
    }

    @DeleteMapping("/{promptId}")
    public ResponseEntity<Void> deleteSharedPrompt(
            Authentication authentication,
            @PathVariable Long promptId) {
        String userEmail = authentication.getName();
        sharedPromptService.deleteSharedPrompt(userEmail, promptId);
        return ResponseEntity.ok().build();
    }
} 