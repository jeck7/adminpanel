package com.example.adminpanel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.*;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getSuggestions(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "system", "content", "You are a helpful assistant that provides prompt engineering suggestions."),
                Map.of("role", "user", "content", "Improve this prompt: " + prompt)
            ));
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path("choices").path(0).path("message").path("content").asText();

        } catch (Exception e) {
            return "Error getting suggestions: " + e.getMessage();
        }
    }

    public String testPrompt(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("max_tokens", 300);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path("choices").path(0).path("message").path("content").asText();

        } catch (Exception e) {
            return "Error testing prompt: " + e.getMessage();
        }
    }

    public String improvePrompt(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "system", "content", "You are an expert prompt engineer. Improve the given prompt to be more specific, clear, and effective."),
                Map.of("role", "user", "content", "Improve this prompt: " + prompt)
            ));
            requestBody.put("max_tokens", 400);
            requestBody.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.path("choices").path(0).path("message").path("content").asText();

        } catch (Exception e) {
            return "Error improving prompt: " + e.getMessage();
        }
    }

    public String getPromptSuggestions(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "Here are some general suggestions for improving your prompt:\n\n" +
                   "1. Be more specific about the desired output format\n" +
                   "2. Include examples of what you want\n" +
                   "3. Specify the tone or style you prefer\n" +
                   "4. Add context about your use case\n" +
                   "5. Consider breaking complex tasks into smaller steps";
        }

        try {
            String analysisPrompt = "Analyze this prompt and provide specific suggestions for improvement. " +
                    "Focus on clarity, specificity, and effectiveness. Provide 3-5 concrete suggestions:\n\n" +
                    "Prompt: " + prompt;

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "user", "content", analysisPrompt)
            ));
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.3);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "Could not generate suggestions. Please try again later.";
    }

    public String generateAlternativePrompt(String originalPrompt, String improvement) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "Alternative prompt (mock):\n\n" + originalPrompt + "\n\n" + improvement;
        }

        try {
            String generationPrompt = "Based on this original prompt and the improvement suggestion, " +
                    "generate an improved version of the prompt:\n\n" +
                    "Original: " + originalPrompt + "\n\n" +
                    "Improvement: " + improvement + "\n\n" +
                    "Improved prompt:";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "user", "content", generationPrompt)
            ));
            requestBody.put("max_tokens", 300);
            requestBody.put("temperature", 0.5);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "Could not generate alternative prompt. Please try again later.";
    }

    public boolean isApiConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }
} 