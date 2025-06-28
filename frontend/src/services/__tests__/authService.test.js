import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '../authService'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          token: 'test-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            firstname: 'Test',
            lastname: 'User',
            role: 'USER'
          }
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await authService.login(credentials)

      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', credentials)
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-jwt-token')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials'
      axios.post.mockRejectedValue(new Error(errorMessage))

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      await expect(authService.login(credentials)).rejects.toThrow(errorMessage)
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('should handle network error', async () => {
      axios.post.mockRejectedValue(new Error('Network Error'))

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      await expect(authService.login(credentials)).rejects.toThrow('Network Error')
    })
  })

  describe('register', () => {
    it('should register successfully and store token', async () => {
      const mockResponse = {
        data: {
          token: 'test-jwt-token',
          user: {
            id: 1,
            email: 'newuser@example.com',
            firstname: 'New',
            lastname: 'User',
            role: 'USER'
          }
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const userData = {
        firstname: 'New',
        lastname: 'User',
        email: 'newuser@example.com',
        password: 'password123'
      }

      const result = await authService.register(userData)

      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', userData)
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-jwt-token')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle registration error', async () => {
      const errorMessage = 'Email already exists'
      axios.post.mockRejectedValue(new Error(errorMessage))

      const userData = {
        firstname: 'New',
        lastname: 'User',
        email: 'existing@example.com',
        password: 'password123'
      }

      await expect(authService.register(userData)).rejects.toThrow(errorMessage)
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })

    it('should handle validation error', async () => {
      const errorMessage = 'Validation failed'
      axios.post.mockRejectedValue(new Error(errorMessage))

      const userData = {
        firstname: '',
        lastname: '',
        email: 'invalid-email',
        password: '123'
      }

      await expect(authService.register(userData)).rejects.toThrow(errorMessage)
    })
  })

  describe('logout', () => {
    it('should clear token from localStorage', () => {
      // Set a token first
      localStorage.setItem('token', 'test-token')
      
      authService.logout()

      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    })

    it('should work even if no token exists', () => {
      authService.logout()

      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const testToken = 'test-jwt-token'
      localStorage.getItem.mockReturnValue(testToken)

      const token = authService.getToken()

      expect(localStorage.getItem).toHaveBeenCalledWith('token')
      expect(token).toBe(testToken)
    })

    it('should return null if no token exists', () => {
      localStorage.getItem.mockReturnValue(null)

      const token = authService.getToken()

      expect(localStorage.getItem).toHaveBeenCalledWith('token')
      expect(token).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.getItem.mockReturnValue('test-token')

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(true)
    })

    it('should return false if no token exists', () => {
      localStorage.getItem.mockReturnValue(null)

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(false)
    })

    it('should return false if token is empty string', () => {
      localStorage.getItem.mockReturnValue('')

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(false)
    })
  })

  describe('getUser', () => {
    it('should return user from localStorage', () => {
      const testUser = {
        id: 1,
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER'
      }
      localStorage.getItem.mockReturnValue(JSON.stringify(testUser))

      const user = authService.getUser()

      expect(localStorage.getItem).toHaveBeenCalledWith('user')
      expect(user).toEqual(testUser)
    })

    it('should return null if no user exists', () => {
      localStorage.getItem.mockReturnValue(null)

      const user = authService.getUser()

      expect(localStorage.getItem).toHaveBeenCalledWith('user')
      expect(user).toBeNull()
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorage.getItem.mockReturnValue('invalid-json')

      const user = authService.getUser()

      expect(user).toBeNull()
    })
  })

  describe('setUser', () => {
    it('should store user in localStorage', () => {
      const testUser = {
        id: 1,
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER'
      }

      authService.setUser(testUser)

      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(testUser))
    })
  })

  describe('axios interceptor', () => {
    it('should add authorization header when token exists', () => {
      const testToken = 'test-jwt-token'
      localStorage.getItem.mockReturnValue(testToken)

      // Re-initialize the service to trigger interceptor
      const service = require('../authService').authService

      // Mock axios request
      const config = { headers: {} }
      const interceptor = axios.interceptors.request.use.mock.calls[0][0]
      const result = interceptor(config)

      expect(result.headers.Authorization).toBe(`Bearer ${testToken}`)
    })

    it('should not add authorization header when no token exists', () => {
      localStorage.getItem.mockReturnValue(null)

      // Re-initialize the service to trigger interceptor
      const service = require('../authService').authService

      // Mock axios request
      const config = { headers: {} }
      const interceptor = axios.interceptors.request.use.mock.calls[0][0]
      const result = interceptor(config)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })
}) 