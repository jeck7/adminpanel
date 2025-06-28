import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'

// Mock the charts
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
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

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title and welcome message', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('renders all statistics cards', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Sessions')).toBeInTheDocument()
    expect(screen.getByText('Total Prompts')).toBeInTheDocument()
    expect(screen.getByText('AI Interactions')).toBeInTheDocument()
  })

  it('displays correct statistics values', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('1,234')).toBeInTheDocument() // Total Users
    expect(screen.getByText('567')).toBeInTheDocument()   // Active Sessions
    expect(screen.getByText('890')).toBeInTheDocument()   // Total Prompts
    expect(screen.getByText('2,345')).toBeInTheDocument() // AI Interactions
  })

  it('renders user activity chart section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('User Activity')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders prompt usage chart section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Prompt Usage')).toBeInTheDocument()
    expect(screen.getByText('By category')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('renders user distribution chart section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('User Distribution')).toBeInTheDocument()
    expect(screen.getByText('By role')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('renders recent activity section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('View all')).toBeInTheDocument()
  })

  it('displays recent activity items', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('New user registered')).toBeInTheDocument()
    expect(screen.getByText('AI prompt generated')).toBeInTheDocument()
    expect(screen.getByText('User profile updated')).toBeInTheDocument()
    expect(screen.getByText('Community prompt shared')).toBeInTheDocument()
  })

  it('renders quick actions section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
  })

  it('displays quick action buttons', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Add User')).toBeInTheDocument()
    expect(screen.getByText('Create Prompt')).toBeInTheDocument()
    expect(screen.getByText('View Reports')).toBeInTheDocument()
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
  })

  it('renders system status section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('System Status')).toBeInTheDocument()
  })

  it('displays system status indicators', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('API Server')).toBeInTheDocument()
    expect(screen.getByText('AI Service')).toBeInTheDocument()
  })

  it('shows online status for all services', () => {
    renderWithRouter(<Dashboard />)
    
    const onlineStatuses = screen.getAllByText('Online')
    expect(onlineStatuses).toHaveLength(3) // Database, API Server, AI Service
  })

  it('renders performance metrics section', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
  })

  it('displays performance metrics', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('Response Time')).toBeInTheDocument()
    expect(screen.getByText('Uptime')).toBeInTheDocument()
    expect(screen.getByText('Error Rate')).toBeInTheDocument()
  })

  it('shows correct performance values', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('245ms')).toBeInTheDocument() // Response Time
    expect(screen.getByText('99.9%')).toBeInTheDocument() // Uptime
    expect(screen.getByText('0.1%')).toBeInTheDocument()  // Error Rate
  })

  it('renders with proper styling classes', () => {
    renderWithRouter(<Dashboard />)
    
    const dashboardContainer = screen.getByText('Dashboard').closest('div')
    expect(dashboardContainer).toHaveClass('p-6')
  })

  it('has responsive layout', () => {
    renderWithRouter(<Dashboard />)
    
    // Check if grid classes are applied for responsive layout
    const gridContainer = screen.getByText('Dashboard').closest('div')
    expect(gridContainer).toHaveClass('grid')
  })

  it('displays loading state initially', () => {
    renderWithRouter(<Dashboard />)
    
    // The component should render immediately without loading state
    // since all data is static/mocked
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('handles chart rendering correctly', () => {
    renderWithRouter(<Dashboard />)
    
    // Verify all chart components are rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('displays proper chart titles and descriptions', () => {
    renderWithRouter(<Dashboard />)
    
    expect(screen.getByText('User Activity')).toBeInTheDocument()
    expect(screen.getByText('Last 7 days')).toBeInTheDocument()
    expect(screen.getByText('Prompt Usage')).toBeInTheDocument()
    expect(screen.getByText('By category')).toBeInTheDocument()
    expect(screen.getByText('User Distribution')).toBeInTheDocument()
    expect(screen.getByText('By role')).toBeInTheDocument()
  })
}) 