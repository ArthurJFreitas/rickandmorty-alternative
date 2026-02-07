import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles loading and disabled states', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    const { rerender } = render(<Button isLoading onClick={handleClick}>Submit</Button>)
    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0)
    expect(screen.queryByText('Submit')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()

    rerender(<Button disabled onClick={handleClick}>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()

    rerender(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
