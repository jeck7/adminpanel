package com.example.adminpanel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prompt_likes")
public class PromptLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shared_prompt_id", nullable = false)
    private SharedPrompt sharedPrompt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public PromptLike() {
    }

    public PromptLike(User user, SharedPrompt sharedPrompt) {
        this.user = user;
        this.sharedPrompt = sharedPrompt;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SharedPrompt getSharedPrompt() {
        return sharedPrompt;
    }

    public void setSharedPrompt(SharedPrompt sharedPrompt) {
        this.sharedPrompt = sharedPrompt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 