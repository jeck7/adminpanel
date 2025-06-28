package com.example.adminpanel.repository;

import com.example.adminpanel.entity.ExampleUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExampleUsageRepository extends JpaRepository<ExampleUsage, Long> {
    
    Optional<ExampleUsage> findByExampleIndex(Integer exampleIndex);
    
    List<ExampleUsage> findAllByOrderByExampleIndexAsc();
} 