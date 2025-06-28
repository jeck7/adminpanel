import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { userService } from '../userService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          role: 'USER'
        },
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          role: 'ADMIN'
        }
      ]

      axios.get.mockResolvedValue({ data: mockUsers })

      const result = await userService.getAllUsers()

      expect(axios.get).toHaveBeenCalledWith('/api/users')
      expect(result).toEqual(mockUsers)
    })

    it('should handle error when fetching users', async () => {
      const errorMessage = 'Failed to fetch users'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.getAllUsers()).rejects.toThrow(errorMessage)
    })

    it('should handle network error', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'))

      await expect(userService.getAllUsers()).rejects.toThrow('Network Error')
    })
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const newUser = {
        firstname: 'New',
        lastname: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'USER'
      }

      const createdUser = {
        id: 3,
        ...newUser,
        password: undefined // Password should not be returned
      }

      axios.post.mockResolvedValue({ data: createdUser })

      const result = await userService.createUser(newUser)

      expect(axios.post).toHaveBeenCalledWith('/api/users', newUser)
      expect(result).toEqual(createdUser)
    })

    it('should handle validation error when creating user', async () => {
      const invalidUser = {
        firstname: '',
        lastname: '',
        email: 'invalid-email',
        password: '123',
        role: 'INVALID_ROLE'
      }

      const errorMessage = 'Validation failed'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(userService.createUser(invalidUser)).rejects.toThrow(errorMessage)
    })

    it('should handle duplicate email error', async () => {
      const existingUser = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
        role: 'USER'
      }

      const errorMessage = 'Email already exists'
      axios.post.mockRejectedValue(new Error(errorMessage))

      await expect(userService.createUser(existingUser)).rejects.toThrow(errorMessage)
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 1
      const updateData = {
        firstname: 'Updated',
        lastname: 'Name',
        role: 'ADMIN'
      }

      const updatedUser = {
        id: userId,
        firstname: 'Updated',
        lastname: 'Name',
        email: 'john@example.com',
        role: 'ADMIN'
      }

      axios.put.mockResolvedValue({ data: updatedUser })

      const result = await userService.updateUser(userId, updateData)

      expect(axios.put).toHaveBeenCalledWith(`/api/users/${userId}`, updateData)
      expect(result).toEqual(updatedUser)
    })

    it('should handle user not found error', async () => {
      const userId = 999
      const updateData = {
        firstname: 'Updated',
        lastname: 'Name'
      }

      const errorMessage = 'User not found'
      axios.put.mockRejectedValue(new Error(errorMessage))

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(errorMessage)
    })

    it('should handle validation error when updating user', async () => {
      const userId = 1
      const invalidUpdateData = {
        firstname: '',
        email: 'invalid-email'
      }

      const errorMessage = 'Validation failed'
      axios.put.mockRejectedValue(new Error(errorMessage))

      await expect(userService.updateUser(userId, invalidUpdateData)).rejects.toThrow(errorMessage)
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = 1

      axios.delete.mockResolvedValue({ status: 204 })

      await userService.deleteUser(userId)

      expect(axios.delete).toHaveBeenCalledWith(`/api/users/${userId}`)
    })

    it('should handle user not found error when deleting', async () => {
      const userId = 999

      const errorMessage = 'User not found'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(userService.deleteUser(userId)).rejects.toThrow(errorMessage)
    })

    it('should handle permission error when deleting user', async () => {
      const userId = 1

      const errorMessage = 'Permission denied'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(userService.deleteUser(userId)).rejects.toThrow(errorMessage)
    })
  })

  describe('getUserById', () => {
    it('should fetch user by id successfully', async () => {
      const userId = 1
      const mockUser = {
        id: userId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        role: 'USER'
      }

      axios.get.mockResolvedValue({ data: mockUser })

      const result = await userService.getUserById(userId)

      expect(axios.get).toHaveBeenCalledWith(`/api/users/${userId}`)
      expect(result).toEqual(mockUser)
    })

    it('should handle user not found error', async () => {
      const userId = 999

      const errorMessage = 'User not found'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.getUserById(userId)).rejects.toThrow(errorMessage)
    })
  })

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      const searchTerm = 'john'
      const mockUsers = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          role: 'USER'
        }
      ]

      axios.get.mockResolvedValue({ data: mockUsers })

      const result = await userService.searchUsers(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/users/search?q=${searchTerm}`)
      expect(result).toEqual(mockUsers)
    })

    it('should handle empty search results', async () => {
      const searchTerm = 'nonexistent'

      axios.get.mockResolvedValue({ data: [] })

      const result = await userService.searchUsers(searchTerm)

      expect(axios.get).toHaveBeenCalledWith(`/api/users/search?q=${searchTerm}`)
      expect(result).toEqual([])
    })

    it('should handle search error', async () => {
      const searchTerm = 'test'

      const errorMessage = 'Search failed'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.searchUsers(searchTerm)).rejects.toThrow(errorMessage)
    })
  })

  describe('getUsersByRole', () => {
    it('should fetch users by role successfully', async () => {
      const role = 'ADMIN'
      const mockUsers = [
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          role: 'ADMIN'
        }
      ]

      axios.get.mockResolvedValue({ data: mockUsers })

      const result = await userService.getUsersByRole(role)

      expect(axios.get).toHaveBeenCalledWith(`/api/users/role/${role}`)
      expect(result).toEqual(mockUsers)
    })

    it('should handle invalid role error', async () => {
      const role = 'INVALID_ROLE'

      const errorMessage = 'Invalid role'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.getUsersByRole(role)).rejects.toThrow(errorMessage)
    })
  })

  describe('getUserStats', () => {
    it('should fetch user statistics successfully', async () => {
      const mockStats = {
        totalUsers: 100,
        activeUsers: 75,
        newUsersThisMonth: 10,
        usersByRole: {
          USER: 80,
          ADMIN: 20
        }
      }

      axios.get.mockResolvedValue({ data: mockStats })

      const result = await userService.getUserStats()

      expect(axios.get).toHaveBeenCalledWith('/api/users/stats')
      expect(result).toEqual(mockStats)
    })

    it('should handle stats fetch error', async () => {
      const errorMessage = 'Failed to fetch stats'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.getUserStats()).rejects.toThrow(errorMessage)
    })
  })

  describe('bulkDeleteUsers', () => {
    it('should delete multiple users successfully', async () => {
      const userIds = [1, 2, 3]

      axios.delete.mockResolvedValue({ status: 204 })

      await userService.bulkDeleteUsers(userIds)

      expect(axios.delete).toHaveBeenCalledWith('/api/users/bulk', { data: { userIds } })
    })

    it('should handle bulk delete error', async () => {
      const userIds = [1, 2, 3]

      const errorMessage = 'Bulk delete failed'
      axios.delete.mockRejectedValue(new Error(errorMessage))

      await expect(userService.bulkDeleteUsers(userIds)).rejects.toThrow(errorMessage)
    })
  })

  describe('exportUsers', () => {
    it('should export users successfully', async () => {
      const format = 'csv'
      const mockBlob = new Blob(['user data'], { type: 'text/csv' })

      axios.get.mockResolvedValue({ 
        data: mockBlob,
        headers: { 'content-type': 'text/csv' }
      })

      const result = await userService.exportUsers(format)

      expect(axios.get).toHaveBeenCalledWith(`/api/users/export?format=${format}`, {
        responseType: 'blob'
      })
      expect(result).toEqual(mockBlob)
    })

    it('should handle export error', async () => {
      const format = 'csv'

      const errorMessage = 'Export failed'
      axios.get.mockRejectedValue(new Error(errorMessage))

      await expect(userService.exportUsers(format)).rejects.toThrow(errorMessage)
    })
  })
}) 