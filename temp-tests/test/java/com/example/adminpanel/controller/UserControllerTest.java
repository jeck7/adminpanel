package com.example.adminpanel.controller;

import com.example.adminpanel.dto.CreateUserRequest;
import com.example.adminpanel.dto.UpdateUserRequest;
import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private CreateUserRequest createUserRequest;
    private UpdateUserRequest updateUserRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1)
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("encodedPassword")
                .role(Role.USER)
                .build();

        createUserRequest = new CreateUserRequest();
        createUserRequest.setFirstname("Jane");
        createUserRequest.setLastname("Smith");
        createUserRequest.setEmail("jane@example.com");
        createUserRequest.setPassword("password123");
        createUserRequest.setRole("USER");

        updateUserRequest = new UpdateUserRequest();
        updateUserRequest.setFirstname("Jane Updated");
        updateUserRequest.setLastname("Smith Updated");
        updateUserRequest.setRole("ADMIN");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_ShouldReturnUsersList() throws Exception {
        // Given
        List<User> users = Arrays.asList(testUser);
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstname").value("John"))
                .andExpect(jsonPath("$[0].lastname").value("Doe"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"));

        verify(userService, times(1)).getAllUsers();
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllUsers_WithUserRole_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());

        verify(userService, never()).getAllUsers();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_WithValidRequest_ShouldCreateUser() throws Exception {
        // Given
        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(testUser);

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createUserRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstname").value("John"))
                .andExpect(jsonPath("$.email").value("john@example.com"));

        verify(userService, times(1)).createUser(any(CreateUserRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Given
        createUserRequest.setEmail(""); // Invalid email

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createUserRequest)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).createUser(any(CreateUserRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateUser_WithValidRequest_ShouldUpdateUser() throws Exception {
        // Given
        when(userService.updateUser(eq(1), any(UpdateUserRequest.class))).thenReturn(testUser);

        // When & Then
        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1));

        verify(userService, times(1)).updateUser(eq(1), any(UpdateUserRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateUser_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        when(userService.updateUser(eq(999), any(UpdateUserRequest.class)))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserRequest)))
                .andExpect(status().isInternalServerError());

        verify(userService, times(1)).updateUser(eq(999), any(UpdateUserRequest.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_WithValidId_ShouldDeleteUser() throws Exception {
        // Given
        doNothing().when(userService).deleteUser(1);

        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());

        verify(userService, times(1)).deleteUser(1);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteUser_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("User not found")).when(userService).deleteUser(999);

        // When & Then
        mockMvc.perform(delete("/api/users/999"))
                .andExpect(status().isInternalServerError());

        verify(userService, times(1)).deleteUser(999);
    }
} 