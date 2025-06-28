package com.example.adminpanel.dto;

public class CreateSharedPromptRequest {
    private String promptContent;
    private String category;
    private String title;
    private String description;
    private Boolean isPublic = true;

    public CreateSharedPromptRequest() {
    }

    public CreateSharedPromptRequest(String promptContent, String category, String title, String description) {
        this.promptContent = promptContent;
        this.category = category;
        this.title = title;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
} 