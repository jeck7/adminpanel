package com.example.adminpanel.controller;

import com.example.adminpanel.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/suggestions")
    public ResponseEntity<Map<String, String>> getSuggestions(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String suggestions = openAIService.getSuggestions(prompt);
        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testPrompt(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String result = openAIService.testPrompt(prompt);
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/improve")
    public ResponseEntity<Map<String, String>> improvePrompt(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String improved = openAIService.improvePrompt(prompt);
        return ResponseEntity.ok(Map.of("improved", improved));
    }

    @PostMapping("/generate-alternative")
    public ResponseEntity<Map<String, Object>> generateAlternative(@RequestBody Map<String, String> request) {
        String originalPrompt = request.get("originalPrompt");
        String improvement = request.get("improvement");
        
        if (originalPrompt == null || originalPrompt.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Original prompt is required"));
        }

        String alternative = openAIService.generateAlternativePrompt(originalPrompt, improvement);
        return ResponseEntity.ok(Map.of(
            "alternative", alternative,
            "apiConfigured", openAIService.isApiConfigured()
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        return ResponseEntity.ok(Map.of(
            "configured", openAIService.isApiConfigured()
        ));
    }
} 