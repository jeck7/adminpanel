package com.example.adminpanel.repository;

import com.example.adminpanel.entity.UserPrompt;
import com.example.adminpanel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPromptRepository extends JpaRepository<UserPrompt, Long> {
    
    List<UserPrompt> findByUserOrderByCreatedAtDesc(User user);
    
    List<UserPrompt> findByUserAndIsFavoriteTrueOrderByCreatedAtDesc(User user);
    
    List<UserPrompt> findByUserAndCategoryOrderByCreatedAtDesc(User user, String category);
    
    List<UserPrompt> findByUserOrderByUsageCountDesc(User user);
} 