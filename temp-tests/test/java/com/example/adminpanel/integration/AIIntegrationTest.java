package com.example.adminpanel.integration;

import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AIIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @WithMockUser(roles = "USER")
    void sendMessage_WithValidRequest_ShouldReturnResponse() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "Hello AI, how are you?");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void sendMessage_WithEmptyMessage_ShouldReturnBadRequest() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    void sendMessage_WithLongMessage_ShouldReturnResponse() throws Exception {
        // Given
        String longMessage = "A".repeat(1000);
        Map<String, String> request = new HashMap<>();
        request.put("message", longMessage);

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void generatePrompt_WithValidRequest_ShouldReturnPrompt() throws Exception {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("type", "creative");
        request.put("topic", "technology");
        request.put("tone", "professional");
        request.put("length", "medium");

        // When & Then
        mockMvc.perform(post("/api/ai/generate-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.prompt").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void generatePrompt_WithInvalidType_ShouldReturnBadRequest() throws Exception {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("type", "invalid_type");
        request.put("topic", "technology");

        // When & Then
        mockMvc.perform(post("/api/ai/generate-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    void analyzePrompt_WithValidPrompt_ShouldReturnAnalysis() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("prompt", "Write a blog post about artificial intelligence");

        // When & Then
        mockMvc.perform(post("/api/ai/analyze-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.analysis").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void analyzePrompt_WithEmptyPrompt_ShouldReturnBadRequest() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("prompt", "");

        // When & Then
        mockMvc.perform(post("/api/ai/analyze-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    void optimizePrompt_WithValidRequest_ShouldReturnOptimizedPrompt() throws Exception {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("prompt", "Write about AI");
        request.put("target", "improve_clarity");
        request.put("style", "professional");

        // When & Then
        mockMvc.perform(post("/api/ai/optimize-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.optimized").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void optimizePrompt_WithEmptyPrompt_ShouldReturnBadRequest() throws Exception {
        // Given
        Map<String, Object> request = new HashMap<>();
        request.put("prompt", "");
        request.put("target", "improve_clarity");

        // When & Then
        mockMvc.perform(post("/api/ai/optimize-prompt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sendMessage_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "Hello AI");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void sendMessage_WithAdminRole_ShouldReturnResponse() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "Hello AI from admin");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void sendMessage_WithSpecialCharacters_ShouldReturnResponse() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "Hello AI! How are you? 😊 This is a test with special characters: @#$%^&*()");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").exists());
    }

    @Test
    @WithMockUser(roles = "USER")
    void sendMessage_WithMultilingualText_ShouldReturnResponse() throws Exception {
        // Given
        Map<String, String> request = new HashMap<>();
        request.put("message", "Hello AI! Здравей AI! Bonjour AI! 你好 AI!");

        // When & Then
        mockMvc.perform(post("/api/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.response").exists());
    }
} 