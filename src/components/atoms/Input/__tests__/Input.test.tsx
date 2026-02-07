import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'
import { describe, it, expect, vi } from 'vitest'

describe('Input', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('renders with default variant', () => {
      render(<Input placeholder="Test" />)
      const input = screen.getByPlaceholderText('Test')
      expect(input).toHaveClass('border-zinc-300', 'focus:ring-emerald-500')
    })

    it('renders with error variant when error is provided', () => {
      render(<Input placeholder="Test" error="This field is required" id="test-input" />)
      const input = screen.getByPlaceholderText('Test')
      expect(input).toHaveClass('border-red-500', 'focus:ring-red-500')
    })

    it('applies custom className', () => {
      render(<Input placeholder="Test" className="custom-input" />)
      const input = screen.getByPlaceholderText('Test')
      expect(input).toHaveClass('custom-input')
    })
  })

  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input placeholder="Disabled" disabled />)
      const input = screen.getByPlaceholderText('Disabled')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:bg-zinc-100')
    })

    it('allows user input when enabled', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" />)

      const input = screen.getByPlaceholderText('Type here')
      await user.type(input, 'Hello')

      expect(input).toHaveValue('Hello')
    })

    it('does not allow input when disabled', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Disabled" disabled />)

      const input = screen.getByPlaceholderText('Disabled')
      await user.type(input, 'Hello')

      expect(input).toHaveValue('')
    })
  })

  describe('Events', () => {
    it('calls onChange handler', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      render(<Input placeholder="Test" onChange={handleChange} />)
      const input = screen.getByPlaceholderText('Test')

      await user.type(input, 'a')

      expect(handleChange).toHaveBeenCalled()
    })
  })
})