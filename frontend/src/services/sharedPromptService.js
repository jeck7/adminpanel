import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

export const sharedPromptService = {
    async createSharedPrompt(promptData) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create shared prompt');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating shared prompt:', error);
            throw error;
        }
    },

    async getPublicPrompts() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch public prompts');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching public prompts:', error);
            throw error;
        }
    },

    async getPublicPromptsByCategory(category) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/category/${encodeURIComponent(category)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch prompts by category');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching prompts by category:', error);
            throw error;
        }
    },

    async getPopularPrompts() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/popular`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch popular prompts');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching popular prompts:', error);
            throw error;
        }
    },

    async getMostUsedPrompts() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/most-used`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch most used prompts');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching most used prompts:', error);
            throw error;
        }
    },

    async getUserSharedPrompts() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/my-prompts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user shared prompts');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching user shared prompts:', error);
            throw error;
        }
    },

    async toggleLike(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/${promptId}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    async hasUserLiked(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/${promptId}/has-liked`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to check like status');
            }
            
            const data = await response.json();
            return data.hasLiked;
        } catch (error) {
            console.error('Error checking like status:', error);
            throw error;
        }
    },

    async incrementUsage(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/${promptId}/increment-usage`, {
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

    async deleteSharedPrompt(promptId) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/shared-prompts/${promptId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete shared prompt');
            }
        } catch (error) {
            console.error('Error deleting shared prompt:', error);
            throw error;
        }
    }
}; 