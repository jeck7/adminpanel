import { API_BASE_URL } from './authService';

const AI_API_URL = `${API_BASE_URL}/api/ai`;

export const aiService = {
    async testPrompt(prompt) {
        try {
            const response = await fetch(`${AI_API_URL}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Failed to test prompt');
            }

            return await response.json();
        } catch (error) {
            console.error('Error testing prompt:', error);
            throw error;
        }
    },

    async getSuggestions(prompt) {
        try {
            const response = await fetch(`${AI_API_URL}/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Failed to get suggestions');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting suggestions:', error);
            throw error;
        }
    },

    async improvePrompt(prompt) {
        try {
            const response = await fetch(`${AI_API_URL}/improve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Failed to improve prompt');
            }

            return await response.json();
        } catch (error) {
            console.error('Error improving prompt:', error);
            throw error;
        }
    }
}; 