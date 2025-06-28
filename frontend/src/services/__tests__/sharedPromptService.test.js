import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sharedPromptService } from '../sharedPromptService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('sharedPromptService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPrompts', () => {
    it('should fetch all shared prompts successfully', async () => {
      const mockPrompts = [
        {
          id: 1,
          title: 'Test Prompt 1',
          content: 'This is test prompt 1',
          author: 'John Doe',
          likes: 5,
          category: 'General'
        },
        {
          id: 2,
          title: 'Test Prompt 2',
          content: 'This is test prompt 2',
          author: 'Jane Smith',
          likes: 3,
          category: 'Creative'
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await sharedPromptService.getAllPrompts()

      expect(axios.get).toHaveBeenCalledWith('/api/shared-prompts')
      expect(result).toEqual(mockPrompts)
    })

    it('should handle error when fetching prompts', async () => {
      const errorMessage = 'Failed to fetch prompts'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(sharedPromptService.getAllPrompts()).rejects.toThrow(errorMessage)
    })
  })

  describe('createPrompt', () => {
    it('should create shared prompt successfully', async () => {
      const newPrompt = {
        title: 'New Shared Prompt',
        content: 'This is a new shared prompt',
        category: 'General',
        isPublic: true
      }

      const createdPrompt = {
        id: 3,
        ...newPrompt,
        author: 'Current User',
        likes: 0,
        createdAt: '2024-01-01T00:00:00Z'
      }

      axios.post.mockResolvedValue({ data: createdPrompt })

      const result = await sharedPromptService.createPrompt(newPrompt)

      expect(axios.post).toHaveBeenCalledWith('/api/shared-prompts', newPrompt)
      expect(result).toEqual(createdPrompt)
    })

    it('should handle validation error when creating prompt', async () => {
      const invalidPrompt = {
        title: '',
        content: '',
        category: 'Invalid'
      }

      const errorMessage = 'Validation failed'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(sharedPromptService.createPrompt(invalidPrompt)).rejects.toThrow(errorMessage)
    })
  })

  describe('likePrompt', () => {
    it('should like a prompt successfully', async () => {
      const promptId = 1
      const mockResponse = {
        id: promptId,
        likes: 6
      }

      axios.post.mockResolvedValue({ data: mockResponse })

      const result = await sharedPromptService.likePrompt(promptId)

      expect(axios.post).toHaveBeenCalledWith(`/api/shared-prompts/${promptId}/like`)
      expect(result).toEqual(mockResponse)
    })

    it('should handle error when liking prompt', async () => {
      const promptId = 1
      const errorMessage = 'Failed to like prompt'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(sharedPromptService.likePrompt(promptId)).rejects.toThrow(errorMessage)
    })
  })

  describe('getPromptById', () => {
    it('should fetch prompt by id successfully', async () => {
      const promptId = 1
      const mockPrompt = {
        id: promptId,
        title: 'Test Prompt',
        content: 'Test content',
        author: 'John Doe',
        likes: 5,
        category: 'General'
      }

      axios.get.mockResolvedValue({ data: mockPrompt })

      const result = await sharedPromptService.getPromptById(promptId)

      expect(axios.get).toHaveBeenCalledWith(`/api/shared-prompts/${promptId}`)
      expect(result).toEqual(mockPrompt)
    })

    it('should handle prompt not found error', async () => {
      const promptId = 999
      const errorMessage = 'Prompt not found'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(sharedPromptService.getPromptById(promptId)).rejects.toThrow(errorMessage)
    })
  })

  describe('searchPrompts', () => {
    it('should search prompts successfully', async () => {
      const searchTerm = 'test'
      const mockPrompts = [
        {
          id: 1,
          title: 'Test Prompt',
          content: 'Test content',
          author: 'John Doe',
          likes: 5,
          category: 'General'
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await sharedPromptService.searchPrompts(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/shared-prompts/search?q=${searchTerm}`)
      expect(result).toEqual(mockPrompts)
    })

    it('should handle empty search results', async () => {
      const searchTerm = 'nonexistent'

      axios.get.mockResolvedValue({ data: [] })

      const result = await sharedPromptService.searchPrompts(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/shared-prompts/search?q=${searchTerm}`)
      expect(result).toEqual([])
    })
  })

  describe('getPromptsByCategory', () => {
    it('should fetch prompts by category successfully', async () => {
      const category = 'Creative'
      const mockPrompts = [
        {
          id: 1,
          title: 'Creative Prompt',
          content: 'Creative content',
          author: 'John Doe',
          likes: 5,
          category: 'Creative'
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await sharedPromptService.getPromptsByCategory(category)

      expect(axios.get).toHaveBeenCalledWith(`/api/shared-prompts/category/${category}`)
      expect(result).toEqual(mockPrompts)
    })

    it('should handle invalid category error', async () => {
      const category = 'InvalidCategory'
      const errorMessage = 'Invalid category'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(sharedPromptService.getPromptsByCategory(category)).rejects.toThrow(errorMessage)
    })
  })

  describe('getTrendingPrompts', () => {
    it('should fetch trending prompts successfully', async () => {
      const mockPrompts = [
        {
          id: 1,
          title: 'Trending Prompt',
          content: 'Trending content',
          author: 'John Doe',
          likes: 100,
          category: 'General'
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await sharedPromptService.getTrendingPrompts()

      expect(axios.get).toHaveBeenCalledWith('/api/shared-prompts/trending')
      expect(result).toEqual(mockPrompts)
    })
  })

  describe('getUserPrompts', () => {
    it('should fetch user prompts successfully', async () => {
      const userId = 1
      const mockPrompts = [
        {
          id: 1,
          title: 'User Prompt',
          content: 'User content',
          author: 'John Doe',
          likes: 5,
          category: 'General'
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await sharedPromptService.getUserPrompts(userId)

      expect(axios.get).toHaveBeenCalledWith(`/api/shared-prompts/user/${userId}`)
      expect(result).toEqual(mockPrompts)
    })
  })
}) 