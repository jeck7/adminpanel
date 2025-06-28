import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminLayout from '../AdminLayout'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' }),
  }
})

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders admin layout with header and sidebar', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    }
    
    const mockOnLogout = vi.fn()
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={mockOnLogout}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders sidebar navigation links', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={vi.fn()}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Prompt Builder')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('renders header with user information', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={vi.fn()}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    }
    
    const mockOnLogout = vi.fn()
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={mockOnLogout}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('renders main content area', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={vi.fn()}>
        <div data-testid="main-content">Main Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.getByText('Main Content')).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={vi.fn()}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    // Check for main layout elements
    const layout = document.querySelector('.flex')
    expect(layout).toBeInTheDocument()
  })

  it('renders with responsive design classes', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser} onLogout={vi.fn()}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    // Check for responsive classes
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('bg-white')
  })

  it('handles missing user gracefully', () => {
    renderWithRouter(
      <AdminLayout user={null} onLogout={vi.fn()}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('handles missing onLogout gracefully', () => {
    const mockUser = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'USER'
    }
    
    renderWithRouter(
      <AdminLayout user={mockUser}>
        <div>Test Content</div>
      </AdminLayout>
    )
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })
}) 