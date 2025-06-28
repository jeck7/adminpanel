package com.example.adminpanel.service;

import com.example.adminpanel.entity.UserPrompt;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.repository.UserPromptRepository;
import com.example.adminpanel.repository.UserRepository;
import com.example.adminpanel.dto.CreateUserPromptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserPromptService {

    @Autowired
    private UserPromptRepository userPromptRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public UserPrompt createUserPrompt(String userEmail, CreateUserPromptRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserPrompt userPrompt = new UserPrompt(user, request.getPromptContent(), 
                request.getCategory(), request.getTitle());
        
        return userPromptRepository.save(userPrompt);
    }

    public List<UserPrompt> getUserPrompts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userPromptRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<UserPrompt> getUserFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userPromptRepository.findByUserAndIsFavoriteTrueOrderByCreatedAtDesc(user);
    }

    public List<UserPrompt> getUserPromptsByCategory(String userEmail, String category) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return userPromptRepository.findByUserAndCategoryOrderByCreatedAtDesc(user, category);
    }

    @Transactional
    public UserPrompt toggleFavorite(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserPrompt userPrompt = userPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Ensure the prompt belongs to the user
        if (!userPrompt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to prompt");
        }
        
        userPrompt.setIsFavorite(!userPrompt.getIsFavorite());
        return userPromptRepository.save(userPrompt);
    }

    @Transactional
    public UserPrompt incrementUsage(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserPrompt userPrompt = userPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Ensure the prompt belongs to the user
        if (!userPrompt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to prompt");
        }
        
        userPrompt.setUsageCount(userPrompt.getUsageCount() + 1);
        return userPromptRepository.save(userPrompt);
    }

    @Transactional
    public void deleteUserPrompt(String userEmail, Long promptId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserPrompt userPrompt = userPromptRepository.findById(promptId)
                .orElseThrow(() -> new RuntimeException("Prompt not found"));
        
        // Ensure the prompt belongs to the user
        if (!userPrompt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to prompt");
        }
        
        userPromptRepository.delete(userPrompt);
    }
} 