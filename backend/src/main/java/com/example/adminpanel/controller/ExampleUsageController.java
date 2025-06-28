package com.example.adminpanel.controller;

import com.example.adminpanel.service.ExampleUsageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/example-usage")
public class ExampleUsageController {

    @Autowired
    private ExampleUsageService exampleUsageService;

    @PostMapping("/increment/{exampleIndex}")
    public ResponseEntity<Void> incrementUsage(@PathVariable Integer exampleIndex) {
        exampleUsageService.incrementUsage(exampleIndex);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<Integer, Integer>> getUsageStats() {
        Map<Integer, Integer> stats = exampleUsageService.getAllUsageStats();
        return ResponseEntity.ok(stats);
    }
} 