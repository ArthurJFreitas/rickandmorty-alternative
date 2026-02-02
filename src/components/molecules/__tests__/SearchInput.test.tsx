import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

describe('SearchInput', () => {
  const mockOnValueChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with placeholder', () => {
    render(<SearchInput value="" onValueChange={mockOnValueChange} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('calls onValueChange when typing', async () => {
    const user = userEvent.setup()
    render(<SearchInput value="" onValueChange={mockOnValueChange} />)

    await user.type(screen.getByRole('searchbox'), 'Rick')
    expect(mockOnValueChange).toHaveBeenCalledTimes(4)
  })

  it('shows and handles clear button', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <SearchInput value="" onValueChange={mockOnValueChange} />
    )

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()

    rerender(<SearchInput value="Rick" onValueChange={mockOnValueChange} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(mockOnValueChange).toHaveBeenCalledWith('')
  })
})
