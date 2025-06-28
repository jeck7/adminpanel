package com.example.adminpanel.repository;

import com.example.adminpanel.entity.SharedPrompt;
import com.example.adminpanel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedPromptRepository extends JpaRepository<SharedPrompt, Long> {
    
    List<SharedPrompt> findByIsPublicTrueOrderByCreatedAtDesc();
    
    List<SharedPrompt> findByIsPublicTrueAndCategoryOrderByCreatedAtDesc(String category);
    
    List<SharedPrompt> findByAuthorOrderByCreatedAtDesc(User author);
    
    List<SharedPrompt> findByIsPublicTrueOrderByLikesCountDesc();
    
    List<SharedPrompt> findByIsPublicTrueOrderByUsageCountDesc();
} 