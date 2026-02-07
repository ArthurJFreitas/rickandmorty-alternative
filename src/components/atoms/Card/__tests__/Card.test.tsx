import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription } from '../Card'
import { describe, it, expect } from 'vitest'

describe('Card', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default variant', () => {
      const { container } = render(<Card>Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies elevated variant', () => {
      const { container } = render(<Card variant="elevated">Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies ghost variant', () => {
      const { container } = render(<Card variant="ghost">Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
    })
  })

  describe('Padding variants', () => {
    it('applies default padding (md)', () => {
      const { container } = render(<Card>Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies no padding', () => {
      const { container } = render(<Card padding="none">Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('applies small padding', () => {
      const { container } = render(<Card padding="sm">Content</Card>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

describe('CardHeader', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies default margin bottom', () => {
      const { container } = render(<CardHeader>Content</CardHeader>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

describe('CardTitle', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<CardTitle>Title text</CardTitle>)
      expect(screen.getByText('Title text')).toBeInTheDocument()
    })

    it('renders as h1 when specified', () => {
      render(<CardTitle as="h1">Title</CardTitle>)
      const title = screen.getByText('Title')
      expect(title.tagName).toBe('H1')
    })

    it('applies default styles', () => {
      render(<CardTitle>Title</CardTitle>)
      const title = screen.getByText('Title')
      expect(title).toBeInTheDocument()
    })
  })
})

describe('CardDescription', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<CardDescription>Description text</CardDescription>)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })
  })
})

describe('Card composition', () => {
  it('renders complete card with all sub-components', () => {
    render(
      <Card variant="elevated" padding="md">
        <CardHeader>
          <CardTitle as="h2">Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
        <div>Card body content</div>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description text')).toBeInTheDocument()
    expect(screen.getByText('Card body content')).toBeInTheDocument()
  })

  it('renders card without header', () => {
    render(
      <Card>
        <div>Just content</div>
      </Card>
    )

    expect(screen.getByText('Just content')).toBeInTheDocument()
  })

  it('renders card without description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title only</CardTitle>
        </CardHeader>
        <div>Content</div>
      </Card>
    )

    expect(screen.getByText('Title only')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders nested structure correctly', () => {
    render(
      <Card padding="none">
        <CardHeader style={{ padding: 16 }}>
          <CardTitle as="h1">Main Title</CardTitle>
          <CardDescription>Supporting text</CardDescription>
        </CardHeader>
        <div style={{ padding: 16 }}>
          <p>Nested content</p>
        </div>
      </Card>
    )

    const title = screen.getByText('Main Title')
    expect(title.tagName).toBe('H1')
    expect(screen.getByText('Supporting text')).toBeInTheDocument()
    expect(screen.getByText('Nested content')).toBeInTheDocument()
  })
})
