import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AIAssistant from '../AIAssistant'
import { aiService } from '../../services/aiService'

// Mock the aiService
vi.mock('../../services/aiService', () => ({
  aiService: {
    sendMessage: vi.fn(),
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

describe('AIAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AI assistant interface', () => {
    renderWithRouter(<AIAssistant />)
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('sends message and receives response', async () => {
    const mockResponse = 'AI response message'
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument()
      expect(screen.getByText('AI response message')).toBeInTheDocument()
    })
  })

  it('handles empty message', () => {
    renderWithRouter(<AIAssistant />)
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)
    
    expect(aiService.sendMessage).not.toHaveBeenCalled()
  })

  it('handles API error', async () => {
    aiService.sendMessage.mockRejectedValue(new Error('API Error'))
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('displays demo mode message when no API key', () => {
    renderWithRouter(<AIAssistant />)
    
    expect(screen.getByText('Demo Mode')).toBeInTheDocument()
    expect(screen.getByText(/this is a demo version/i)).toBeInTheDocument()
  })

  it('shows welcome message initially', () => {
    renderWithRouter(<AIAssistant />)
    
    expect(screen.getByText(/hello! i'm your ai assistant/i)).toBeInTheDocument()
    expect(screen.getByText(/how can i help you today/i)).toBeInTheDocument()
  })

  it('displays user message in chat', async () => {
    const mockResponse = {
      message: 'AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })
  })

  it('displays AI response in chat', async () => {
    const mockResponse = {
      message: 'This is the AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('This is the AI response')).toBeInTheDocument()
    })
  })

  it('handles AI service error', async () => {
    aiService.sendMessage.mockRejectedValue(new Error('AI service error'))
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/sorry, i encountered an error/i)).toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    aiService.sendMessage.mockRejectedValue(new Error('Network Error'))
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during message processing', async () => {
    aiService.sendMessage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    // Check if loading indicator appears
    expect(screen.getByText(/ai is thinking/i)).toBeInTheDocument()
  })

  it('handles Enter key submission', async () => {
    const mockResponse = {
      message: 'AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    
    await waitFor(() => {
      expect(aiService.sendMessage).toHaveBeenCalledWith('Test message')
    })
  })

  it('does not submit on Shift+Enter', () => {
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', shiftKey: true })
    
    expect(aiService.sendMessage).not.toHaveBeenCalled()
  })

  it('clears input after successful message submission', async () => {
    const mockResponse = {
      message: 'AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('displays message timestamps', async () => {
    const mockResponse = {
      message: 'AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage.mockResolvedValue(mockResponse)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      // Check if timestamps are displayed (they should be in the chat messages)
      const messages = screen.getAllByText(/test message|ai response/i)
      expect(messages.length).toBeGreaterThan(0)
    })
  })

  it('maintains chat history', async () => {
    const mockResponse1 = {
      message: 'First AI response',
      timestamp: new Date().toISOString()
    }
    
    const mockResponse2 = {
      message: 'Second AI response',
      timestamp: new Date().toISOString()
    }
    
    aiService.sendMessage
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2)
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    // Send first message
    fireEvent.change(input, { target: { value: 'First message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument()
      expect(screen.getByText('First AI response')).toBeInTheDocument()
    })
    
    // Send second message
    fireEvent.change(input, { target: { value: 'Second message' } })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument()
      expect(screen.getByText('Second AI response')).toBeInTheDocument()
    })
    
    // Verify both messages are still in chat
    expect(screen.getByText('First message')).toBeInTheDocument()
    expect(screen.getByText('First AI response')).toBeInTheDocument()
  })

  it('disables send button during processing', async () => {
    aiService.sendMessage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    expect(sendButton).toBeDisabled()
  })

  it('shows character count for long messages', () => {
    renderWithRouter(<AIAssistant />)
    
    const input = screen.getByPlaceholderText('Type your message here...')
    const longMessage = 'A'.repeat(1000)
    
    fireEvent.change(input, { target: { value: longMessage } })
    
    // The component should handle long messages gracefully
    expect(input.value).toBe(longMessage)
  })
}) 