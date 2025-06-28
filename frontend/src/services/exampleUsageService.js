import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

export const exampleUsageService = {
    async incrementUsage(exampleIndex) {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/example-usage/increment/${exampleIndex}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to increment usage');
            }
        } catch (error) {
            console.error('Error incrementing usage:', error);
            throw error;
        }
    },

    async getUsageStats() {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_BASE_URL}/example-usage/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch usage stats');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching usage stats:', error);
            throw error;
        }
    }
}; 