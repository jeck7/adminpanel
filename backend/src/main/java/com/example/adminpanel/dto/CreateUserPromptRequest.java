package com.example.adminpanel.dto;

public class CreateUserPromptRequest {
    private String promptContent;
    private String category;
    private String title;

    public CreateUserPromptRequest() {
    }

    public CreateUserPromptRequest(String promptContent, String category, String title) {
        this.promptContent = promptContent;
        this.category = category;
        this.title = title;
    }

    public String getPromptContent() {
        return promptContent;
    }

    public void setPromptContent(String promptContent) {
        this.promptContent = promptContent;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
} 