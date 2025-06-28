package com.example.adminpanel.service;

import com.example.adminpanel.entity.ExampleUsage;
import com.example.adminpanel.repository.ExampleUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExampleUsageService {

    @Autowired
    private ExampleUsageRepository exampleUsageRepository;

    @Transactional
    public void incrementUsage(Integer exampleIndex) {
        ExampleUsage usage = exampleUsageRepository.findByExampleIndex(exampleIndex)
                .orElse(new ExampleUsage(exampleIndex, 0));
        
        usage.setUsageCount(usage.getUsageCount() + 1);
        exampleUsageRepository.save(usage);
    }

    public Map<Integer, Integer> getAllUsageStats() {
        List<ExampleUsage> allUsage = exampleUsageRepository.findAllByOrderByExampleIndexAsc();
        Map<Integer, Integer> stats = new HashMap<>();
        
        for (ExampleUsage usage : allUsage) {
            stats.put(usage.getExampleIndex(), usage.getUsageCount());
        }
        
        return stats;
    }
} 