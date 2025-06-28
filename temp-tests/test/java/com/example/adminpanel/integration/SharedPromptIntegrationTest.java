package com.example.adminpanel.integration;

import com.example.adminpanel.dto.CreateSharedPromptRequest;
import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.SharedPrompt;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.SharedPromptRepository;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class SharedPromptIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private SharedPromptRepository sharedPromptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Create test user
        testUser = User.builder()
                .firstname("Test")
                .lastname("User")
                .email("test@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.USER)
                .build();
        userRepository.save(testUser);
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllPrompts_ShouldReturnPromptsList() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("Test Prompt")
                .content("This is a test prompt")
                .category("General")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Test Prompt"))
                .andExpect(jsonPath("$[0].content").value("This is a test prompt"))
                .andExpect(jsonPath("$[0].category").value("General"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createPrompt_WithValidRequest_ShouldCreatePrompt() throws Exception {
        // Given
        CreateSharedPromptRequest request = new CreateSharedPromptRequest();
        request.setTitle("New Shared Prompt");
        request.setContent("This is a new shared prompt");
        request.setCategory("Creative");
        request.setTags("tag1,tag2");

        // When & Then
        mockMvc.perform(post("/api/shared-prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("New Shared Prompt"))
                .andExpect(jsonPath("$.content").value("This is a new shared prompt"))
                .andExpect(jsonPath("$.category").value("Creative"));

        // Verify prompt was saved
        SharedPrompt savedPrompt = sharedPromptRepository.findByTitle("New Shared Prompt").orElse(null);
        assertThat(savedPrompt).isNotNull();
        assertThat(savedPrompt.getTitle()).isEqualTo("New Shared Prompt");
        assertThat(savedPrompt.getContent()).isEqualTo("This is a new shared prompt");
    }

    @Test
    @WithMockUser(roles = "USER")
    void createPrompt_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Given
        CreateSharedPromptRequest request = new CreateSharedPromptRequest();
        request.setTitle(""); // Invalid
        request.setContent(""); // Invalid

        // When & Then
        mockMvc.perform(post("/api/shared-prompts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getPromptById_WithValidId_ShouldReturnPrompt() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("Test Prompt")
                .content("Test content")
                .category("General")
                .author(testUser)
                .likes(0)
                .build();
        SharedPrompt savedPrompt = sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts/" + savedPrompt.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value("Test Prompt"))
                .andExpect(jsonPath("$.content").value("Test content"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getPromptById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/shared-prompts/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    void likePrompt_WithValidId_ShouldIncrementLikes() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("Test Prompt")
                .content("Test content")
                .category("General")
                .author(testUser)
                .likes(0)
                .build();
        SharedPrompt savedPrompt = sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(post("/api/shared-prompts/" + savedPrompt.getId() + "/like"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.likes").value(1));

        // Verify likes were incremented
        SharedPrompt updatedPrompt = sharedPromptRepository.findById(savedPrompt.getId()).orElse(null);
        assertThat(updatedPrompt).isNotNull();
        assertThat(updatedPrompt.getLikes()).isEqualTo(1);
    }

    @Test
    @WithMockUser(roles = "USER")
    void likePrompt_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(post("/api/shared-prompts/999/like"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchPrompts_WithValidQuery_ShouldReturnMatchingPrompts() throws Exception {
        // Given
        SharedPrompt prompt1 = SharedPrompt.builder()
                .title("AI Prompt")
                .content("This is about AI")
                .category("Technology")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt1);

        SharedPrompt prompt2 = SharedPrompt.builder()
                .title("Creative Prompt")
                .content("This is creative")
                .category("Creative")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt2);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts/search?q=AI"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("AI Prompt"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getPromptsByCategory_WithValidCategory_ShouldReturnPrompts() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("Creative Prompt")
                .content("This is creative")
                .category("Creative")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts/category/Creative"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Creative Prompt"))
                .andExpect(jsonPath("$[0].category").value("Creative"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getTrendingPrompts_ShouldReturnPromptsOrderedByLikes() throws Exception {
        // Given
        SharedPrompt prompt1 = SharedPrompt.builder()
                .title("Popular Prompt")
                .content("This is popular")
                .category("General")
                .author(testUser)
                .likes(10)
                .build();
        sharedPromptRepository.save(prompt1);

        SharedPrompt prompt2 = SharedPrompt.builder()
                .title("Less Popular Prompt")
                .content("This is less popular")
                .category("General")
                .author(testUser)
                .likes(5)
                .build();
        sharedPromptRepository.save(prompt2);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts/trending"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Popular Prompt"))
                .andExpect(jsonPath("$[0].likes").value(10));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getUserPrompts_ShouldReturnUserPrompts() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("User Prompt")
                .content("This is user's prompt")
                .category("General")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("User Prompt"))
                .andExpect(jsonPath("$[0].author.id").value(testUser.getId()));
    }

    @Test
    void getAllPrompts_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/shared-prompts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllPrompts_WithAdminRole_ShouldReturnPrompts() throws Exception {
        // Given
        SharedPrompt prompt = SharedPrompt.builder()
                .title("Admin Test Prompt")
                .content("This is admin test prompt")
                .category("General")
                .author(testUser)
                .likes(0)
                .build();
        sharedPromptRepository.save(prompt);

        // When & Then
        mockMvc.perform(get("/api/shared-prompts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Admin Test Prompt"));
    }
} 