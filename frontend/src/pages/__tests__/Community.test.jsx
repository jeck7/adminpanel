import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Community from '../Community'
import { sharedPromptService } from '../../services/sharedPromptService'

// Mock the sharedPromptService
vi.mock('../../services/sharedPromptService', () => ({
  sharedPromptService: {
    getAllPrompts: vi.fn(),
    createPrompt: vi.fn(),
    likePrompt: vi.fn(),
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

describe('Community Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders community page with title', () => {
    renderWithRouter(<Community />)
    
    expect(screen.getByText('Community')).toBeInTheDocument()
  })

  it('renders share prompt button', () => {
    renderWithRouter(<Community />)
    
    expect(screen.getByRole('button', { name: /share prompt/i })).toBeInTheDocument()
  })

  it('opens share prompt modal when button is clicked', () => {
    renderWithRouter(<Community />)
    
    const shareButton = screen.getByRole('button', { name: /share prompt/i })
    fireEvent.click(shareButton)
    
    expect(screen.getByText('Share Your Prompt')).toBeInTheDocument()
  })

  it('displays prompts when data is loaded', async () => {
    const mockPrompts = [
      {
        id: 1,
        title: 'Test Prompt',
        content: 'This is a test prompt',
        author: 'John Doe',
        likes: 5,
        category: 'General'
      }
    ]
    
    sharedPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    
    renderWithRouter(<Community />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Prompt')).toBeInTheDocument()
      expect(screen.getByText('This is a test prompt')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    sharedPromptService.getAllPrompts.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<Community />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles error when loading prompts', async () => {
    sharedPromptService.getAllPrompts.mockRejectedValue(new Error('Failed to load prompts'))
    
    renderWithRouter(<Community />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('filters prompts by category', async () => {
    const mockPrompts = [
      { id: 1, title: 'General Prompt', content: 'General content', category: 'General' },
      { id: 2, title: 'Creative Prompt', content: 'Creative content', category: 'Creative' }
    ]
    
    sharedPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    
    renderWithRouter(<Community />)
    
    await waitFor(() => {
      expect(screen.getByText('General Prompt')).toBeInTheDocument()
      expect(screen.getByText('Creative Prompt')).toBeInTheDocument()
    })
    
    const categoryFilter = screen.getByRole('combobox')
    fireEvent.change(categoryFilter, { target: { value: 'Creative' } })
    
    expect(screen.queryByText('General Prompt')).not.toBeInTheDocument()
    expect(screen.getByText('Creative Prompt')).toBeInTheDocument()
  })

  it('allows liking prompts', async () => {
    const mockPrompts = [
      {
        id: 1,
        title: 'Test Prompt',
        content: 'Test content',
        likes: 0
      }
    ]
    
    sharedPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    sharedPromptService.likePrompt.mockResolvedValue({ likes: 1 })
    
    renderWithRouter(<Community />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    })
    
    const likeButton = screen.getByRole('button', { name: /like/i })
    fireEvent.click(likeButton)
    
    expect(sharedPromptService.likePrompt).toHaveBeenCalledWith(1)
  })
}) 