import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exampleUsageService } from '../exampleUsageService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('exampleUsageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllExamples', () => {
    it('should fetch all example usages successfully', async () => {
      const mockExamples = [
        {
          id: 1,
          title: 'Example 1',
          description: 'This is example 1',
          prompt: 'Sample prompt 1',
          response: 'Sample response 1',
          category: 'General',
          tags: ['tag1', 'tag2']
        },
        {
          id: 2,
          title: 'Example 2',
          description: 'This is example 2',
          prompt: 'Sample prompt 2',
          response: 'Sample response 2',
          category: 'Creative',
          tags: ['tag3', 'tag4']
        }
      ]

      axios.get.mockResolvedValue({ data: mockExamples })

      const result = await exampleUsageService.getAllExamples()

      expect(axios.get).toHaveBeenCalledWith('/api/example-usages')
      expect(result).toEqual(mockExamples)
    })

    it('should handle error when fetching examples', async () => {
      const errorMessage = 'Failed to fetch examples'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.getAllExamples()).rejects.toThrow(errorMessage)
    })
  })

  describe('createExample', () => {
    it('should create example usage successfully', async () => {
      const newExample = {
        title: 'New Example',
        description: 'This is a new example',
        prompt: 'Sample prompt',
        response: 'Sample response',
        category: 'General',
        tags: ['new', 'example']
      }

      const createdExample = {
        id: 3,
        ...newExample,
        createdAt: '2024-01-01T00:00:00Z'
      }

      axios.post.mockResolvedValue({ data: createdExample })

      const result = await exampleUsageService.createExample(newExample)

      expect(axios.post).toHaveBeenCalledWith('/api/example-usages', newExample)
      expect(result).toEqual(createdExample)
    })

    it('should handle validation error when creating example', async () => {
      const invalidExample = {
        title: '',
        description: '',
        prompt: '',
        response: ''
      }

      const errorMessage = 'Validation failed'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.createExample(invalidExample)).rejects.toThrow(errorMessage)
    })
  })

  describe('updateExample', () => {
    it('should update example usage successfully', async () => {
      const exampleId = 1
      const updateData = {
        title: 'Updated Example',
        description: 'Updated description',
        category: 'Creative'
      }

      const updatedExample = {
        id: exampleId,
        ...updateData,
        prompt: 'Sample prompt',
        response: 'Sample response',
        tags: ['updated'],
        updatedAt: '2024-01-01T00:00:00Z'
      }

      axios.put.mockResolvedValue({ data: updatedExample })

      const result = await exampleUsageService.updateExample(exampleId, updateData)

      expect(axios.put).toHaveBeenCalledWith(`/api/example-usages/${exampleId}`, updateData)
      expect(result).toEqual(updatedExample)
    })

    it('should handle example not found error', async () => {
      const exampleId = 999
      const updateData = {
        title: 'Updated Example'
      }

      const errorMessage = 'Example not found'
      axios.put.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.updateExample(exampleId, updateData)).rejects.toThrow(errorMessage)
    })
  })

  describe('deleteExample', () => {
    it('should delete example usage successfully', async () => {
      const exampleId = 1

      axios.delete.mockResolvedValue({ status: 204 })

      await exampleUsageService.deleteExample(exampleId)

      expect(axios.delete).toHaveBeenCalledWith(`/api/example-usages/${exampleId}`)
    })

    it('should handle error when deleting example', async () => {
      const exampleId = 1
      const errorMessage = 'Failed to delete example'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.deleteExample(exampleId)).rejects.toThrow(errorMessage)
    })
  })

  describe('getExampleById', () => {
    it('should fetch example by id successfully', async () => {
      const exampleId = 1
      const mockExample = {
        id: exampleId,
        title: 'Test Example',
        description: 'Test description',
        prompt: 'Test prompt',
        response: 'Test response',
        category: 'General',
        tags: ['test']
      }

      axios.get.mockResolvedValue({ data: mockExample })

      const result = await exampleUsageService.getExampleById(exampleId)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/${exampleId}`)
      expect(result).toEqual(mockExample)
    })

    it('should handle example not found error', async () => {
      const exampleId = 999
      const errorMessage = 'Example not found'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.getExampleById(exampleId)).rejects.toThrow(errorMessage)
    })
  })

  describe('searchExamples', () => {
    it('should search examples successfully', async () => {
      const searchTerm = 'test'
      const mockExamples = [
        {
          id: 1,
          title: 'Test Example',
          description: 'Test description',
          prompt: 'Test prompt',
          response: 'Test response',
          category: 'General',
          tags: ['test']
        }
      ]

      axios.get.mockResolvedValue({ data: mockExamples })

      const result = await exampleUsageService.searchExamples(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/search?q=${searchTerm}`)
      expect(result).toEqual(mockExamples)
    })

    it('should handle empty search results', async () => {
      const searchTerm = 'nonexistent'

      axios.get.mockResolvedValue({ data: [] })

      const result = await exampleUsageService.searchExamples(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/search?q=${searchTerm}`)
      expect(result).toEqual([])
    })
  })

  describe('getExamplesByCategory', () => {
    it('should fetch examples by category successfully', async () => {
      const category = 'Creative'
      const mockExamples = [
        {
          id: 1,
          title: 'Creative Example',
          description: 'Creative description',
          prompt: 'Creative prompt',
          response: 'Creative response',
          category: 'Creative',
          tags: ['creative']
        }
      ]

      axios.get.mockResolvedValue({ data: mockExamples })

      const result = await exampleUsageService.getExamplesByCategory(category)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/category/${category}`)
      expect(result).toEqual(mockExamples)
    })

    it('should handle invalid category error', async () => {
      const category = 'InvalidCategory'
      const errorMessage = 'Invalid category'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(exampleUsageService.getExamplesByCategory(category)).rejects.toThrow(errorMessage)
    })
  })

  describe('getExamplesByTags', () => {
    it('should fetch examples by tags successfully', async () => {
      const tags = ['ai', 'machine-learning']
      const mockExamples = [
        {
          id: 1,
          title: 'AI Example',
          description: 'AI description',
          prompt: 'AI prompt',
          response: 'AI response',
          category: 'Technology',
          tags: ['ai', 'machine-learning']
        }
      ]

      axios.get.mockResolvedValue({ data: mockExamples })

      const result = await exampleUsageService.getExamplesByTags(tags)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/tags?tags=${tags.join(',')}`)
      expect(result).toEqual(mockExamples)
    })
  })

  describe('getPopularExamples', () => {
    it('should fetch popular examples successfully', async () => {
      const mockExamples = [
        {
          id: 1,
          title: 'Popular Example',
          description: 'Popular description',
          prompt: 'Popular prompt',
          response: 'Popular response',
          category: 'General',
          tags: ['popular'],
          views: 1000
        }
      ]

      axios.get.mockResolvedValue({ data: mockExamples })

      const result = await exampleUsageService.getPopularExamples()

      expect(axios.get).toHaveBeenCalledWith('/api/example-usages/popular')
      expect(result).toEqual(mockExamples)
    })
  })

  describe('incrementViews', () => {
    it('should increment example views successfully', async () => {
      const exampleId = 1
      const mockResponse = {
        id: exampleId,
        views: 1001
      }

      axios.post.mockResolvedValue({ data: mockResponse })

      const result = await exampleUsageService.incrementViews(exampleId)

      expect(axios.post).toHaveBeenCalledWith(`/api/example-usages/${exampleId}/views`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('exportExamples', () => {
    it('should export examples successfully', async () => {
      const format = 'json'
      const mockBlob = new Blob(['example data'], { type: 'application/json' })

      axios.get.mockResolvedValue({ 
        data: mockBlob,
        headers: { 'content-type': 'application/json' }
      })

      const result = await exampleUsageService.exportExamples(format)

      expect(axios.get).toHaveBeenCalledWith(`/api/example-usages/export?format=${format}`, {
        responseType: 'blob'
      })
      expect(result).toEqual(mockBlob)
    })
  })
}) 