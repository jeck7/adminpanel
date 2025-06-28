import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'

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

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sidebar with navigation links', () => {
    renderWithRouter(<Sidebar />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByText('Prompt Builder')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('renders all navigation icons', () => {
    renderWithRouter(<Sidebar />)
    
    // Check for icon elements (they should be present as SVG or icon components)
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toBeInTheDocument()
  })

  it('highlights active route', () => {
    renderWithRouter(<Sidebar />)
    
    // Dashboard should be active since useLocation returns '/dashboard'
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink).toHaveClass('bg-blue-600')
  })

  it('renders sidebar with proper styling', () => {
    renderWithRouter(<Sidebar />)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toHaveClass('bg-white')
    expect(sidebar).toHaveClass('shadow-lg')
  })

  it('renders all menu items', () => {
    renderWithRouter(<Sidebar />)
    
    const menuItems = [
      'Dashboard',
      'Users', 
      'AI Assistant',
      'Prompt Builder',
      'Community',
      'Profile'
    ]
    
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('has proper link structure', () => {
    renderWithRouter(<Sidebar />)
    
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(6) // Dashboard, Users, AI Assistant, Prompt Builder, Community, Profile
  })
}) 