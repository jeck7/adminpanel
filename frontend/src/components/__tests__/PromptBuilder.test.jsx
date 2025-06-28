import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PromptBuilder from '../PromptBuilder'

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

describe('PromptBuilder Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders prompt builder interface', () => {
    renderWithRouter(<PromptBuilder />)
    
    expect(screen.getByText('Prompt Builder')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your prompt here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('allows user to input prompt text', () => {
    renderWithRouter(<PromptBuilder />)
    
    const textarea = screen.getByPlaceholderText('Enter your prompt here...')
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    
    expect(textarea.value).toBe('Test prompt')
  })

  it('shows character count', () => {
    renderWithRouter(<PromptBuilder />)
    
    const textarea = screen.getByPlaceholderText('Enter your prompt here...')
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    
    expect(screen.getByText('11 characters')).toBeInTheDocument()
  })

  it('handles empty prompt submission', () => {
    renderWithRouter(<PromptBuilder />)
    
    const generateButton = screen.getByRole('button', { name: /generate/i })
    fireEvent.click(generateButton)
    
    // Should not proceed with empty prompt
    expect(screen.getByText('0 characters')).toBeInTheDocument()
  })

  it('clears prompt after generation', () => {
    renderWithRouter(<PromptBuilder />)
    
    const textarea = screen.getByPlaceholderText('Enter your prompt here...')
    const clearButton = screen.getByRole('button', { name: /clear/i })
    
    fireEvent.change(textarea, { target: { value: 'Test prompt' } })
    fireEvent.click(clearButton)
    
    expect(textarea.value).toBe('')
  })
}) 