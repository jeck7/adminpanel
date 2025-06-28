package com.example.adminpanel.repository;

import com.example.adminpanel.entity.PromptLike;
import com.example.adminpanel.entity.User;
import com.example.adminpanel.entity.SharedPrompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromptLikeRepository extends JpaRepository<PromptLike, Long> {
    
    Optional<PromptLike> findByUserAndSharedPrompt(User user, SharedPrompt sharedPrompt);
    
    List<PromptLike> findByUser(User user);
    
    List<PromptLike> findBySharedPrompt(SharedPrompt sharedPrompt);
    
    long countBySharedPrompt(SharedPrompt sharedPrompt);
} 