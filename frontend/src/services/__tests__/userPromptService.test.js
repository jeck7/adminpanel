import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { userPromptService } from '../userPromptService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('userPromptService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPrompts', () => {
    it('should fetch all user prompts successfully', async () => {
      const mockPrompts = [
        {
          id: 1,
          title: 'My Prompt 1',
          content: 'This is my prompt 1',
          category: 'General',
          isPublic: false
        },
        {
          id: 2,
          title: 'My Prompt 2',
          content: 'This is my prompt 2',
          category: 'Creative',
          isPublic: true
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await userPromptService.getAllPrompts()

      expect(axios.get).toHaveBeenCalledWith('/api/user-prompts')
      expect(result).toEqual(mockPrompts)
    })

    it('should handle error when fetching prompts', async () => {
      const errorMessage = 'Failed to fetch prompts'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userPromptService.getAllPrompts()).rejects.toThrow(errorMessage)
    })
  })

  describe('createPrompt', () => {
    it('should create user prompt successfully', async () => {
      const newPrompt = {
        title: 'New User Prompt',
        content: 'This is a new user prompt',
        category: 'General',
        isPublic: false
      }

      const createdPrompt = {
        id: 3,
        ...newPrompt,
        createdAt: '2024-01-01T00:00:00Z'
      }

      axios.post.mockResolvedValue({ data: createdPrompt })

      const result = await userPromptService.createPrompt(newPrompt)

      expect(axios.post).toHaveBeenCalledWith('/api/user-prompts', newPrompt)
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

      await expect(userPromptService.createPrompt(invalidPrompt)).rejects.toThrow(errorMessage)
    })
  })

  describe('updatePrompt', () => {
    it('should update user prompt successfully', async () => {
      const promptId = 1
      const updateData = {
        title: 'Updated Prompt',
        content: 'Updated content',
        category: 'Creative'
      }

      const updatedPrompt = {
        id: promptId,
        ...updateData,
        isPublic: false,
        updatedAt: '2024-01-01T00:00:00Z'
      }

      axios.put.mockResolvedValue({ data: updatedPrompt })

      const result = await userPromptService.updatePrompt(promptId, updateData)

      expect(axios.put).toHaveBeenCalledWith(`/api/user-prompts/${promptId}`, updateData)
      expect(result).toEqual(updatedPrompt)
    })

    it('should handle prompt not found error', async () => {
      const promptId = 999
      const updateData = {
        title: 'Updated Prompt'
      }

      const errorMessage = 'Prompt not found'
      axios.put.mockRejectedValue(new Error(errorMessage))

      await expect(userPromptService.updatePrompt(promptId, updateData)).rejects.toThrow(errorMessage)
    })
  })

  describe('deletePrompt', () => {
    it('should delete user prompt successfully', async () => {
      const promptId = 1

      axios.delete.mockResolvedValue({ status: 204 })

      await userPromptService.deletePrompt(promptId)

      expect(axios.delete).toHaveBeenCalledWith(`/api/user-prompts/${promptId}`)
    })

    it('should handle error when deleting prompt', async () => {
      const promptId = 1
      const errorMessage = 'Failed to delete prompt'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(userPromptService.deletePrompt(promptId)).rejects.toThrow(errorMessage)
    })
  })

  describe('getPromptById', () => {
    it('should fetch user prompt by id successfully', async () => {
      const promptId = 1
      const mockPrompt = {
        id: promptId,
        title: 'Test User Prompt',
        content: 'Test content',
        category: 'General',
        isPublic: false
      }

      axios.get.mockResolvedValue({ data: mockPrompt })

      const result = await userPromptService.getPromptById(promptId)

      expect(axios.get).toHaveBeenCalledWith(`/api/user-prompts/${promptId}`)
      expect(result).toEqual(mockPrompt)
    })

    it('should handle prompt not found error', async () => {
      const promptId = 999
      const errorMessage = 'Prompt not found'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userPromptService.getPromptById(promptId)).rejects.toThrow(errorMessage)
    })
  })

  describe('searchPrompts', () => {
    it('should search user prompts successfully', async () => {
      const searchTerm = 'test'
      const mockPrompts = [
        {
          id: 1,
          title: 'Test User Prompt',
          content: 'Test content',
          category: 'General',
          isPublic: false
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await userPromptService.searchPrompts(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/user-prompts/search?q=${searchTerm}`)
      expect(result).toEqual(mockPrompts)
    })

    it('should handle empty search results', async () => {
      const searchTerm = 'nonexistent'

      axios.get.mockResolvedValue({ data: [] })

      const result = await userPromptService.searchPrompts(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/user-prompts/search?q=${searchTerm}`)
      expect(result).toEqual([])
    })
  })

  describe('getPromptsByCategory', () => {
    it('should fetch user prompts by category successfully', async () => {
      const category = 'Creative'
      const mockPrompts = [
        {
          id: 1,
          title: 'Creative User Prompt',
          content: 'Creative content',
          category: 'Creative',
          isPublic: true
        }
      ]

      axios.get.mockResolvedValue({ data: mockPrompts })

      const result = await userPromptService.getPromptsByCategory(category)

      expect(axios.get).toHaveBeenCalledWith(`/api/user-prompts/category/${category}`)
      expect(result).toEqual(mockPrompts)
    })
  })

  describe('togglePromptVisibility', () => {
    it('should toggle prompt visibility successfully', async () => {
      const promptId = 1
      const mockResponse = {
        id: promptId,
        isPublic: true
      }

      axios.patch.mockResolvedValue({ data: mockResponse })

      const result = await userPromptService.togglePromptVisibility(promptId)

      expect(axios.patch).toHaveBeenCalledWith(`/api/user-prompts/${promptId}/visibility`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('duplicatePrompt', () => {
    it('should duplicate prompt successfully', async () => {
      const promptId = 1
      const duplicatedPrompt = {
        id: 2,
        title: 'Test User Prompt (Copy)',
        content: 'Test content',
        category: 'General',
        isPublic: false
      }

      axios.post.mockResolvedValue({ data: duplicatedPrompt })

      const result = await userPromptService.duplicatePrompt(promptId)

      expect(axios.post).toHaveBeenCalledWith(`/api/user-prompts/${promptId}/duplicate`)
      expect(result).toEqual(duplicatedPrompt)
    })
  })

  describe('exportPrompts', () => {
    it('should export user prompts successfully', async () => {
      const format = 'json'
      const mockBlob = new Blob(['prompt data'], { type: 'application/json' })

      axios.get.mockResolvedValue({ 
        data: mockBlob,
        headers: { 'content-type': 'application/json' }
      })

      const result = await userPromptService.exportPrompts(format)

      expect(axios.get).toHaveBeenCalledWith(`/api/user-prompts/export?format=${format}`, {
        responseType: 'blob'
      })
      expect(result).toEqual(mockBlob)
    })
  })
}) 