import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'
import { authService } from '../../services/authService'

// Mock the authService
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    renderWithRouter(<Login />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
  })

  it('switches between login and register modes', () => {
    renderWithRouter(<Login />)
    
    // Initially in login mode
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    
    // Switch to register mode
    fireEvent.click(screen.getByText("Don't have an account?"))
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    
    // Switch back to login mode
    fireEvent.click(screen.getByText('Already have an account?'))
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('handles login form submission successfully', async () => {
    const mockLoginResponse = {
      token: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER'
      }
    }
    
    authService.login.mockResolvedValue(mockLoginResponse)
    
    renderWithRouter(<Login />)
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('handles register form submission successfully', async () => {
    const mockRegisterResponse = {
      token: 'test-token',
      user: {
        id: 1,
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'USER'
      }
    }
    
    authService.register.mockResolvedValue(mockRegisterResponse)
    
    renderWithRouter(<Login />)
    
    // Switch to register mode
    fireEvent.click(screen.getByText("Don't have an account?"))
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Test' }
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'User' }
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('displays error message on login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'))
    
    renderWithRouter(<Login />)
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' }
    })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('displays error message on register failure', async () => {
    authService.register.mockRejectedValue(new Error('Email already exists'))
    
    renderWithRouter(<Login />)
    
    // Switch to register mode
    fireEvent.click(screen.getByText("Don't have an account?"))
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Test' }
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'User' }
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'existing@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    renderWithRouter(<Login />)
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(authService.login).not.toHaveBeenCalled()
    })
  })

  it('shows loading state during form submission', async () => {
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<Login />)
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Check if button shows loading state
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
  })

  it('handles password visibility toggle', () => {
    renderWithRouter(<Login />)
    
    const passwordInput = screen.getByPlaceholderText('Password')
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Toggle visibility
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Toggle back
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
}) 