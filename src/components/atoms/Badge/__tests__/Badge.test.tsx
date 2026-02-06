import { render, screen } from '@/test-utils/test-utils'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders with different variants and custom className', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('bg-emerald-100', 'text-emerald-700')

    rerender(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText('Danger')).toHaveClass('bg-red-100', 'text-red-700')

    rerender(<Badge className="custom-class">Custom</Badge>)
    expect(screen.getByText('Custom')).toHaveClass('custom-class', 'inline-flex')
  })
})
