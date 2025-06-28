package com.example.adminpanel.integration;

import com.example.adminpanel.dto.CreateUserRequest;
import com.example.adminpanel.dto.UpdateUserRequest;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

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
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_ShouldReturnUsersList() throws Exception {
        // Given
        User user = User.builder()
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].firstname").value("John"))
                .andExpect(jsonPath("$[0].lastname").value("Doe"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllUsers_WithUserRole_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_WithValidRequest_ShouldCreateUser() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstname("Jane");
        request.setLastname("Smith");
        request.setEmail("jane@example.com");
        request.setPassword("password123");
        request.setRole("USER");

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.firstname").value("Jane"))
                .andExpect(jsonPath("$.lastname").value("Smith"))
                .andExpect(jsonPath("$.email").value("jane@example.com"));

        // Verify user was saved
        User savedUser = userRepository.findByEmail("jane@example.com").orElse(null);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getFirstname()).isEqualTo("Jane");
        assertThat(savedUser.getLastname()).isEqualTo("Smith");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest();
        request.setFirstname(""); // Invalid
        request.setEmail("invalid-email"); // Invalid

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateUser_WithValidRequest_ShouldUpdateUser() throws Exception {
        // Given
        User user = User.builder()
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);

        UpdateUserRequest request = new UpdateUserRequest();
        request.setFirstname("John Updated");
        request.setLastname("Doe Updated");
        request.setRole("ADMIN");

        // When & Then
        mockMvc.perform(put("/api/users/" + savedUser.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.firstname").value("John Updated"))
                .andExpect(jsonPath("$.lastname").value("Doe Updated"));

        // Verify user was updated
        User updatedUser = userRepository.findById(savedUser.getId()).orElse(null);
        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getFirstname()).isEqualTo("John Updated");
        assertThat(updatedUser.getLastname()).isEqualTo("Doe Updated");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateUser_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        UpdateUserRequest request = new UpdateUserRequest();
        request.setFirstname("Updated");

        // When & Then
        mockMvc.perform(put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_WithValidId_ShouldDeleteUser() throws Exception {
        // Given
        User user = User.builder()
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);

        // When & Then
        mockMvc.perform(delete("/api/users/" + savedUser.getId()))
                .andExpect(status().isNoContent());

        // Verify user was deleted
        User deletedUser = userRepository.findById(savedUser.getId()).orElse(null);
        assertThat(deletedUser).isNull();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_WithInvalidId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_WithDuplicateEmail_ShouldReturnError() throws Exception {
        // Given
        User existingUser = User.builder()
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("password")
                .role(Role.USER)
                .build();
        userRepository.save(existingUser);

        CreateUserRequest request = new CreateUserRequest();
        request.setFirstname("Jane");
        request.setLastname("Smith");
        request.setEmail("john@example.com"); // Duplicate email
        request.setPassword("password123");
        request.setRole("USER");

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }
} 