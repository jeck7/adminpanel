import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

export const userPromptService = {
    async createUserPrompt(promptData) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create user prompt');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating user prompt:', error);
            throw error;
        }
    },

    async getUserPrompts() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user prompts');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching user prompts:', error);
            throw error;
        }
    },

    async getUserFavorites() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user favorites');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            throw error;
        }
    },

    async getUserPromptsByCategory(category) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts/category/${encodeURIComponent(category)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user prompts by category');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching user prompts by category:', error);
            throw error;
        }
    },

    async toggleFavorite(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts/${promptId}/favorite`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle favorite');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    },

    async incrementUsage(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts/${promptId}/increment-usage`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to increment usage');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error incrementing usage:', error);
            throw error;
        }
    },

    async deleteUserPrompt(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/user-prompts/${promptId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete user prompt');
            }
        } catch (error) {
            console.error('Error deleting user prompt:', error);
            throw error;
        }
    }
}; 