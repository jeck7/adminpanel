import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Profile from '../Profile'
import { userService } from '../../services/userService'

// Mock the userService
vi.mock('../../services/userService', () => ({
  userService: {
    updateUser: vi.fn(),
    getUserById: vi.fn(),
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

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders profile page with title', () => {
    renderWithRouter(<Profile />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('displays user information when loaded', async () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    userService.getUserById.mockResolvedValue(mockUser)
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })
  })

  it('allows editing user information', async () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    userService.getUserById.mockResolvedValue(mockUser)
    userService.updateUser.mockResolvedValue({ ...mockUser, firstname: 'Jane' })
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })
    
    const firstNameInput = screen.getByDisplayValue('John')
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } })
    
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)
    
    expect(userService.updateUser).toHaveBeenCalledWith(1, {
      firstname: 'Jane',
      lastname: 'Doe',
      role: 'USER'
    })
  })

  it('shows loading state initially', () => {
    userService.getUserById.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<Profile />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles error when loading profile', async () => {
    userService.getUserById.mockRejectedValue(new Error('Failed to load profile'))
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('validates form fields', async () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    userService.getUserById.mockResolvedValue(mockUser)
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })
    
    const firstNameInput = screen.getByDisplayValue('John')
    fireEvent.change(firstNameInput, { target: { value: '' } })
    
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)
    
    expect(userService.updateUser).not.toHaveBeenCalled()
  })

  it('shows success message after successful update', async () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    userService.getUserById.mockResolvedValue(mockUser)
    userService.updateUser.mockResolvedValue(mockUser)
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })
    
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message when update fails', async () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    userService.getUserById.mockResolvedValue(mockUser)
    userService.updateUser.mockRejectedValue(new Error('Update failed'))
    
    renderWithRouter(<Profile />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })
    
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument()
    })
  })
}) 