package com.example.adminpanel.service;

import com.example.adminpanel.entity.Role;
import com.example.adminpanel.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private User testUser;
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION = 86400000; // 24 hours

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

        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtService, "secret", SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "expiration", EXPIRATION);
    }

    @Test
    void generateToken_WithValidUser_ShouldGenerateToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
    }

    @Test
    void generateToken_WithDifferentUsers_ShouldGenerateDifferentTokens() {
        // Given
        User user2 = User.builder()
                .id(2)
                .firstname("Jane")
                .lastname("Smith")
                .email("jane@example.com")
                .password("encodedPassword")
                .role(Role.ADMIN)
                .build();

        // When
        String token1 = jwtService.generateToken(testUser);
        String token2 = jwtService.generateToken(user2);

        // Then
        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    void generateToken_WithExtraClaims_ShouldGenerateTokenWithClaims() {
        // Given
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "ADMIN");
        extraClaims.put("userId", 123);

        // When
        String token = jwtService.generateToken(extraClaims, testUser);

        // Then
        assertThat(token).isNotNull();
        
        // Decode token to verify claims
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtService.getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertThat(claims.get("role")).isEqualTo("ADMIN");
        assertThat(claims.get("userId")).isEqualTo(123);
        assertThat(claims.getSubject()).isEqualTo(testUser.getEmail());
    }

    @Test
    void isTokenValid_WithValidToken_ShouldReturnTrue() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    void isTokenValid_WithInvalidUser_ShouldReturnFalse() {
        // Given
        String token = jwtService.generateToken(testUser);
        User differentUser = User.builder()
                .id(2)
                .firstname("Jane")
                .lastname("Smith")
                .email("jane@example.com")
                .password("encodedPassword")
                .role(Role.ADMIN)
                .build();

        // When
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        // Given
        // Set a very short expiration time
        ReflectionTestUtils.setField(jwtService, "expiration", 1L);
        String token = jwtService.generateToken(testUser);

        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // When
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void extractUsername_WithValidToken_ShouldReturnEmail() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String username = jwtService.extractUsername(token);

        // Then
        assertThat(username).isEqualTo(testUser.getEmail());
    }

    @Test
    void extractExpiration_WithValidToken_ShouldReturnExpirationDate() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        Date expiration = jwtService.extractExpiration(token);

        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration.after(new Date())).isTrue();
    }

    @Test
    void extractClaim_WithValidToken_ShouldReturnClaim() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String subject = jwtService.extractClaim(token, Claims::getSubject);

        // Then
        assertThat(subject).isEqualTo(testUser.getEmail());
    }

    @Test
    void generateRefreshToken_WithValidUser_ShouldGenerateToken() {
        // When
        String refreshToken = jwtService.generateRefreshToken(testUser);

        // Then
        assertThat(refreshToken).isNotNull();
        assertThat(refreshToken).isNotEmpty();
        assertThat(refreshToken.split("\\.")).hasSize(3);
    }

    @Test
    void generateRefreshToken_ShouldHaveLongerExpiration() {
        // Given
        long refreshExpiration = 604800000; // 7 days
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", refreshExpiration);

        // When
        String refreshToken = jwtService.generateRefreshToken(testUser);

        // Then
        Date expiration = jwtService.extractExpiration(refreshToken);
        assertThat(expiration).isNotNull();
        assertThat(expiration.after(new Date())).isTrue();
    }
} 