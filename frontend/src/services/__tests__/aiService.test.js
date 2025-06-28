import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { aiService } from '../aiService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('sendMessage', () => {
    it('should send message to AI successfully', async () => {
      const message = 'Hello AI, how are you?'
      const mockResponse = {
        data: {
          response: 'Hello! I am doing well, thank you for asking. How can I help you today?',
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30
          }
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const result = await aiService.sendMessage(message)

      expect(axios.post).toHaveBeenCalledWith('/api/ai/chat', { message })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle AI service error', async () => {
      const message = 'Hello AI'
      const errorMessage = 'AI service is currently unavailable'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.sendMessage(message)).rejects.toThrow(errorMessage)
    })

    it('should handle network error', async () => {
      const message = 'Hello AI'
      axios.post.mockRejectedValue(new Error('Network Error'))

      await expect(aiService.sendMessage(message)).rejects.toThrow('Network Error')
    })

    it('should handle empty message', async () => {
      const message = ''
      const errorMessage = 'Message cannot be empty'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.sendMessage(message)).rejects.toThrow(errorMessage)
    })
  })

  describe('generatePrompt', () => {
    it('should generate prompt successfully', async () => {
      const promptRequest = {
        type: 'creative',
        topic: 'technology',
        tone: 'professional',
        length: 'medium'
      }

      const mockResponse = {
        data: {
          prompt: 'Write a professional article about the latest technology trends in 2024.',
          suggestions: [
            'Focus on AI and machine learning',
            'Include real-world examples',
            'Discuss future implications'
          ]
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const result = await aiService.generatePrompt(promptRequest)

      expect(axios.post).toHaveBeenCalledWith('/api/ai/generate-prompt', promptRequest)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle prompt generation error', async () => {
      const promptRequest = {
        type: 'invalid',
        topic: 'test'
      }

      const errorMessage = 'Invalid prompt type'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.generatePrompt(promptRequest)).rejects.toThrow(errorMessage)
    })
  })

  describe('analyzePrompt', () => {
    it('should analyze prompt successfully', async () => {
      const prompt = 'Write a blog post about artificial intelligence'
      const mockResponse = {
        data: {
          analysis: {
            clarity: 8.5,
            specificity: 7.0,
            complexity: 'Medium',
            suggestions: [
              'Consider adding a specific angle or perspective',
              'Include target audience information'
            ]
          }
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const result = await aiService.analyzePrompt(prompt)

      expect(axios.post).toHaveBeenCalledWith('/api/ai/analyze-prompt', { prompt })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle prompt analysis error', async () => {
      const prompt = ''
      const errorMessage = 'Prompt cannot be empty'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.analyzePrompt(prompt)).rejects.toThrow(errorMessage)
    })
  })

  describe('optimizePrompt', () => {
    it('should optimize prompt successfully', async () => {
      const prompt = 'Write about AI'
      const optimizationRequest = {
        prompt,
        target: 'improve_clarity',
        style: 'professional'
      }

      const mockResponse = {
        data: {
          original: 'Write about AI',
          optimized: 'Write a comprehensive article about artificial intelligence, focusing on its current applications and future potential in various industries.',
          improvements: [
            'Added specificity to the topic',
            'Included target focus areas',
            'Enhanced professional tone'
          ]
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const result = await aiService.optimizePrompt(optimizationRequest)

      expect(axios.post).toHaveBeenCalledWith('/api/ai/optimize-prompt', optimizationRequest)
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle prompt optimization error', async () => {
      const optimizationRequest = {
        prompt: '',
        target: 'improve_clarity'
      }

      const errorMessage = 'Invalid optimization request'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.optimizePrompt(optimizationRequest)).rejects.toThrow(errorMessage)
    })
  })

  describe('getConversationHistory', () => {
    it('should fetch conversation history successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            message: 'Hello AI',
            response: 'Hello! How can I help you?',
            timestamp: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            message: 'What is AI?',
            response: 'AI stands for Artificial Intelligence...',
            timestamp: '2024-01-01T00:01:00Z'
          }
        ]
      }

      axios.get.mockResolvedValue(mockResponse)

      const result = await aiService.getConversationHistory()

      expect(axios.get).toHaveBeenCalledWith('/api/ai/conversation-history')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle conversation history error', async () => {
      const errorMessage = 'Failed to fetch conversation history'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.getConversationHistory()).rejects.toThrow(errorMessage)
    })
  })

  describe('clearConversationHistory', () => {
    it('should clear conversation history successfully', async () => {
      axios.delete.mockResolvedValue({ status: 204 })

      await aiService.clearConversationHistory()

      expect(axios.delete).toHaveBeenCalledWith('/api/ai/conversation-history')
    })

    it('should handle clear history error', async () => {
      const errorMessage = 'Failed to clear conversation history'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.clearConversationHistory()).rejects.toThrow(errorMessage)
    })
  })

  describe('getAIModels', () => {
    it('should fetch available AI models successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: 'gpt-4',
            name: 'GPT-4',
            description: 'Most capable model',
            maxTokens: 8192
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Fast and efficient',
            maxTokens: 4096
          }
        ]
      }

      axios.get.mockResolvedValue(mockResponse)

      const result = await aiService.getAIModels()

      expect(axios.get).toHaveBeenCalledWith('/api/ai/models')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle AI models fetch error', async () => {
      const errorMessage = 'Failed to fetch AI models'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.getAIModels()).rejects.toThrow(errorMessage)
    })
  })

  describe('getAIUsage', () => {
    it('should fetch AI usage statistics successfully', async () => {
      const mockResponse = {
        data: {
          totalRequests: 150,
          totalTokens: 50000,
          averageResponseTime: 2.5,
          monthlyUsage: [
            { month: 'Jan', requests: 25 },
            { month: 'Feb', requests: 30 }
          ]
        }
      }

      axios.get.mockResolvedValue(mockResponse)

      const result = await aiService.getAIUsage()

      expect(axios.get).toHaveBeenCalledWith('/api/ai/usage')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle AI usage fetch error', async () => {
      const errorMessage = 'Failed to fetch AI usage'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(aiService.getAIUsage()).rejects.toThrow(errorMessage)
    })
  })
}) 