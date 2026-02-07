import { render, screen } from '@/test-utils/test-utils'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders with different variants and custom className', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()

    rerender(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText('Danger')).toBeInTheDocument()

    rerender(<Badge className="custom-class">Custom</Badge>)
    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })
})
