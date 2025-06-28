import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Users from '../Users'
import { userService } from '../../services/userService'

// Mock the userService
vi.mock('../../services/userService', () => ({
  userService: {
    getAllUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
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

describe('Users Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders users page with title', () => {
    renderWithRouter(<Users />)
    
    expect(screen.getByText('Users Management')).toBeInTheDocument()
  })

  it('renders add user button', () => {
    renderWithRouter(<Users />)
    
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument()
  })

  it('opens create user modal when add button is clicked', () => {
    renderWithRouter(<Users />)
    
    const addButton = screen.getByRole('button', { name: /add user/i })
    fireEvent.click(addButton)
    
    expect(screen.getByText('Create New User')).toBeInTheDocument()
  })

  it('displays users table when data is loaded', async () => {
    const mockUsers = [
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        role: 'USER'
      }
    ]
    
    userService.getAllUsers.mockResolvedValue(mockUsers)
    
    renderWithRouter(<Users />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    userService.getAllUsers.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<Users />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles error when loading users', async () => {
    userService.getAllUsers.mockRejectedValue(new Error('Failed to load users'))
    
    renderWithRouter(<Users />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('filters users by search term', async () => {
    const mockUsers = [
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'USER' },
      { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', role: 'ADMIN' }
    ]
    
    userService.getAllUsers.mockResolvedValue(mockUsers)
    
    renderWithRouter(<Users />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search users/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('filters users by role', async () => {
    const mockUsers = [
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'USER' },
      { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', role: 'ADMIN' }
    ]
    
    userService.getAllUsers.mockResolvedValue(mockUsers)
    
    renderWithRouter(<Users />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
    
    const roleFilter = screen.getByRole('combobox')
    fireEvent.change(roleFilter, { target: { value: 'ADMIN' } })
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })
}) 