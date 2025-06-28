import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PromptEngineering from '../PromptEngineering'
import { userPromptService } from '../../services/userPromptService'

// Mock the userPromptService
vi.mock('../../services/userPromptService', () => ({
  userPromptService: {
    getAllPrompts: vi.fn(),
    createPrompt: vi.fn(),
    updatePrompt: vi.fn(),
    deletePrompt: vi.fn(),
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

describe('PromptEngineering Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders prompt engineering page with title', () => {
    renderWithRouter(<PromptEngineering />)
    
    expect(screen.getByText('Prompt Engineering')).toBeInTheDocument()
  })

  it('renders create prompt button', () => {
    renderWithRouter(<PromptEngineering />)
    
    expect(screen.getByRole('button', { name: /create prompt/i })).toBeInTheDocument()
  })

  it('opens create prompt modal when button is clicked', () => {
    renderWithRouter(<PromptEngineering />)
    
    const createButton = screen.getByRole('button', { name: /create prompt/i })
    fireEvent.click(createButton)
    
    expect(screen.getByText('Create New Prompt')).toBeInTheDocument()
  })

  it('displays prompts when data is loaded', async () => {
    const mockPrompts = [
      {
        id: 1,
        title: 'Test Prompt',
        content: 'This is a test prompt',
        category: 'General',
        isPublic: false
      }
    ]
    
    userPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Prompt')).toBeInTheDocument()
      expect(screen.getByText('This is a test prompt')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    userPromptService.getAllPrompts.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<PromptEngineering />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles error when loading prompts', async () => {
    userPromptService.getAllPrompts.mockRejectedValue(new Error('Failed to load prompts'))
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('filters prompts by category', async () => {
    const mockPrompts = [
      { id: 1, title: 'General Prompt', content: 'General content', category: 'General' },
      { id: 2, title: 'Creative Prompt', content: 'Creative content', category: 'Creative' }
    ]
    
    userPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText('General Prompt')).toBeInTheDocument()
      expect(screen.getByText('Creative Prompt')).toBeInTheDocument()
    })
    
    const categoryFilter = screen.getByRole('combobox')
    fireEvent.change(categoryFilter, { target: { value: 'Creative' } })
    
    expect(screen.queryByText('General Prompt')).not.toBeInTheDocument()
    expect(screen.getByText('Creative Prompt')).toBeInTheDocument()
  })

  it('allows editing prompts', async () => {
    const mockPrompts = [
      {
        id: 1,
        title: 'Test Prompt',
        content: 'Test content',
        category: 'General'
      }
    ]
    
    userPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    userPromptService.updatePrompt.mockResolvedValue({ ...mockPrompts[0], title: 'Updated Prompt' })
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    })
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(screen.getByText('Edit Prompt')).toBeInTheDocument()
  })

  it('allows deleting prompts', async () => {
    const mockPrompts = [
      {
        id: 1,
        title: 'Test Prompt',
        content: 'Test content',
        category: 'General'
      }
    ]
    
    userPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    userPromptService.deletePrompt.mockResolvedValue()
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Prompt')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(userPromptService.deletePrompt).toHaveBeenCalledWith(1)
  })

  it('searches prompts by title', async () => {
    const mockPrompts = [
      { id: 1, title: 'First Prompt', content: 'First content', category: 'General' },
      { id: 2, title: 'Second Prompt', content: 'Second content', category: 'Creative' }
    ]
    
    userPromptService.getAllPrompts.mockResolvedValue(mockPrompts)
    
    renderWithRouter(<PromptEngineering />)
    
    await waitFor(() => {
      expect(screen.getByText('First Prompt')).toBeInTheDocument()
      expect(screen.getByText('Second Prompt')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText(/search prompts/i)
    fireEvent.change(searchInput, { target: { value: 'First' } })
    
    expect(screen.getByText('First Prompt')).toBeInTheDocument()
    expect(screen.queryByText('Second Prompt')).not.toBeInTheDocument()
  })
}) 