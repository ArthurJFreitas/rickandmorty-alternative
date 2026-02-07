import { render, screen } from '@testing-library/react'
import { Spinner } from '../Spinner'
import { describe, it, expect } from 'vitest'

describe('Spinner', () => {
  describe('Rendering', () => {
    it('renders spinner with status role', () => {
      render(<Spinner />)
      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
    })

    it('renders with default label', () => {
      render(<Spinner />)
      expect(screen.getByText('Loading')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<Spinner label="Processing data" />)
      expect(screen.getByText('Processing data')).toBeInTheDocument()
    })

    it('label is visually hidden but accessible to screen readers', () => {
      render(<Spinner label="Loading content" />)
      const label = screen.getByText('Loading content')
      expect(label).toHaveClass('sr-only')
    })

    it('spinner element has aria-hidden', () => {
      const { container } = render(<Spinner />)
      const spinnerElement = container.querySelector('div[aria-hidden="true"]')
      expect(spinnerElement).toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('renders with default medium size', () => {
      const { container } = render(<Spinner />)
      const spinnerElement = container.querySelector('div[aria-hidden="true"]')
      expect(spinnerElement).toHaveClass('h-8', 'w-8', 'border-[3px]')
    })

    it('renders with small size', () => {
      const { container } = render(<Spinner size="sm" />)
      const spinnerElement = container.querySelector('div[aria-hidden="true"]')
      expect(spinnerElement).toHaveClass('h-4', 'w-4', 'border-2')
    })

    it('renders with large size', () => {
      const { container } = render(<Spinner size="lg" />)
      const spinnerElement = container.querySelector('div[aria-hidden="true"]')
      expect(spinnerElement).toHaveClass('h-12', 'w-12', 'border-4')
    })
  })


  describe('Visual regression protection', () => {
    it('maintains consistent structure', () => {
      const { container } = render(<Spinner />)

      const status = container.querySelector('[role="status"]')
      expect(status).toBeInTheDocument()

      const spinner = status?.querySelector('div[aria-hidden="true"]')
      expect(spinner).toBeInTheDocument()

      const label = status?.querySelector('.sr-only')
      expect(label).toBeInTheDocument()
    })
  })
})
