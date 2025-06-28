package com.example.adminpanel.service;

import com.example.adminpanel.entity.SharedPrompt;
import com.example.adminpanel.entity.PromptLike;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.SharedPromptRepository;
import com.example.adminpanel.repository.PromptLikeRepository;
import com.example.adminpanel.repository.UserRepository;
import com.example.adminpanel.dto.CreateSharedPromptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SharedPromptService {

    @Autowired
    private SharedPromptRepository sharedPromptRepository;

    @Autowired
    private PromptLikeRepository promptLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public SharedPrompt createSharedPrompt(String userEmail, CreateSharedPromptRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SharedPrompt sharedPrompt = new SharedPrompt(user, request.getPromptContent(), 
                request.getCategory(), request.getTitle(), request.getDescription());
        sharedPrompt.setIsPublic(request.getIsPublic());
        
        return sharedPromptRepository.save(sharedPrompt);
    }

    public List<SharedPrompt> getPublicPrompts() {
        return sharedPromptRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }

    public List<SharedPrompt> getPublicPromptsByCategory(String category) {
        return sharedPromptRepository.findByIsPublicTrueAndCategoryOrderByCreatedAtDesc(category);
    }

    public List<SharedPrompt> getPopularPrompts() {
        return sharedPromptRepository.findByIsPublicTrueOrderByLikesCountDesc();
    }

    public List<SharedPrompt> getMostUsedPrompts() {
        return sharedPromptRepository.findByIsPublicTrueOrderByUsageCountDesc();
    }

    public List<SharedPrompt> getUserSharedPrompts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return sharedPromptRepository.findByAuthorOrderByCreatedAtDesc(user);
    }

    @Transactional
    public SharedPrompt toggleLike(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SharedPrompt sharedPrompt = sharedPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Shared prompt not found"));
        
        Optional<PromptLike> existingLike = promptLikeRepository.findByUserAndSharedPrompt(user, sharedPrompt);
        
        if (existingLike.isPresent()) {
            // Unlike
            promptLikeRepository.delete(existingLike.get());
            sharedPrompt.setLikesCount(sharedPrompt.getLikesCount() - 1);
        } else {
            // Like
            PromptLike newLike = new PromptLike(user, sharedPrompt);
            promptLikeRepository.save(newLike);
            sharedPrompt.setLikesCount(sharedPrompt.getLikesCount() + 1);
        }
        
        return sharedPromptRepository.save(sharedPrompt);
    }

    public boolean hasUserLiked(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SharedPrompt sharedPrompt = sharedPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Shared prompt not found"));
        
        return promptLikeRepository.findByUserAndSharedPrompt(user, sharedPrompt).isPresent();
    }

    @Transactional
    public SharedPrompt incrementUsage(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SharedPrompt sharedPrompt = sharedPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Shared prompt not found"));
        
        sharedPrompt.setUsageCount(sharedPrompt.getUsageCount() + 1);
        return sharedPromptRepository.save(sharedPrompt);
    }

    @Transactional
    public void deleteSharedPrompt(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        SharedPrompt sharedPrompt = sharedPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Shared prompt not found"));
        
        // Ensure the prompt belongs to the user
        if (!sharedPrompt.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to shared prompt");
        }
        
        // Delete all likes first
        List<PromptLike> likes = promptLikeRepository.findBySharedPrompt(sharedPrompt);
        promptLikeRepository.deleteAll(likes);
        
        sharedPromptRepository.delete(sharedPrompt);
    }
} 