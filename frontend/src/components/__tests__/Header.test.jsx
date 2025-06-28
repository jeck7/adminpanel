import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'

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

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders header with title', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders user menu when user is provided', () => {
    const mockUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com'
    }
    
    renderWithRouter(<Header user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('shows logout button when onLogout is provided', () => {
    const mockOnLogout = vi.fn()
    
    renderWithRouter(<Header onLogout={mockOnLogout} />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', () => {
    const mockOnLogout = vi.fn()
    
    renderWithRouter(<Header onLogout={mockOnLogout} />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('renders notification bell icon', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument()
  })

  it('renders user avatar when user is provided', () => {
    const mockUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com'
    }
    
    renderWithRouter(<Header user={mockUser} />)
    
    expect(screen.getByText('JD')).toBeInTheDocument() // Avatar initials
  })
}) 