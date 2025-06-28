import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { authService } from '../services/authService'

// Mock the authService
vi.mock('../services/authService', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getUser: vi.fn(),
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

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login page when not authenticated', () => {
    authService.isAuthenticated.mockReturnValue(false)
    
    renderWithRouter(<App />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
  })

  it('renders admin layout when authenticated', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    }
    
    authService.isAuthenticated.mockReturnValue(true)
    authService.getUser.mockReturnValue(mockUser)
    
    renderWithRouter(<App />)
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders sidebar navigation when authenticated', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    authService.isAuthenticated.mockReturnValue(true)
    authService.getUser.mockReturnValue(mockUser)
    
    renderWithRouter(<App />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Prompt Builder')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('shows dashboard by default when authenticated', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    authService.isAuthenticated.mockReturnValue(true)
    authService.getUser.mockReturnValue(mockUser)
    
    renderWithRouter(<App />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('handles authentication state changes', () => {
    // Initially not authenticated
    authService.isAuthenticated.mockReturnValue(false)
    
    const { rerender } = renderWithRouter(<App />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    
    // Then authenticated
    authService.isAuthenticated.mockReturnValue(true)
    authService.getUser.mockReturnValue({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    })
    
    rerender(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders with proper styling classes', () => {
    authService.isAuthenticated.mockReturnValue(false)
    
    renderWithRouter(<App />)
    
    const appContainer = document.querySelector('.App')
    expect(appContainer).toBeInTheDocument()
  })
}) 