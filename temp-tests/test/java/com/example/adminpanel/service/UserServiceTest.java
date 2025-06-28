package com.example.adminpanel.service;

import com.example.adminpanel.dto.CreateUserRequest;
import com.example.adminpanel.dto.UpdateUserRequest;
import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

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
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> expectedUsers = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(expectedUsers);

        // When
        List<User> actualUsers = userService.getAllUsers();

        // Then
        assertThat(actualUsers).isEqualTo(expectedUsers);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void createUser_WithValidRequest_ShouldCreateUser() {
        // Given
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User createdUser = userService.createUser(createUserRequest);

        // Then
        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getFirstname()).isEqualTo("Jane");
        assertThat(createdUser.getLastname()).isEqualTo("Smith");
        assertThat(createdUser.getEmail()).isEqualTo("jane@example.com");
        assertThat(createdUser.getRole()).isEqualTo(Role.USER);

        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_WithAdminRole_ShouldCreateAdminUser() {
        // Given
        createUserRequest.setRole("ADMIN");
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User createdUser = userService.createUser(createUserRequest);

        // Then
        assertThat(createdUser).isNotNull();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithValidId_ShouldUpdateUser() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User updatedUser = userService.updateUser(1, updateUserRequest);

        // Then
        assertThat(updatedUser).isNotNull();
        assertThat(updatedUser.getFirstname()).isEqualTo("Jane Updated");
        assertThat(updatedUser.getLastname()).isEqualTo("Smith Updated");
        assertThat(updatedUser.getRole()).isEqualTo(Role.ADMIN);

        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateUser_WithInvalidId_ShouldThrowException() {
        // Given
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updateUser(999, updateUserRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findById(999);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_WithValidId_ShouldDeleteUser() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).deleteById(1);

        // When
        userService.deleteUser(1);

        // Then
        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).deleteById(1);
    }

    @Test
    void deleteUser_WithInvalidId_ShouldThrowException() {
        // Given
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.deleteUser(999))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findById(999);
        verify(userRepository, never()).deleteById(anyInt());
    }
} 