import { render, screen, within } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { CustomDropdown } from '../CustomDropdown'
import '@testing-library/jest-dom'

describe('CustomDropdown', () => {
  const mockOptions = [
    { value: 'all', label: 'All Options' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]

  const mockOnValueChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('opens dropdown and displays all options', async () => {
    const user = userEvent.setup()
    render(
      <CustomDropdown
        label="Test Label"
        options={mockOptions}
        value="all"
        onValueChange={mockOnValueChange}
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()

    const button = screen.getByRole('button')
    await user.click(button)

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(mockOptions.length)
  })

  it('selects option and closes dropdown', async () => {
    const user = userEvent.setup()
    render(
      <CustomDropdown
        label="Test Label"
        options={mockOptions}
        value="all"
        onValueChange={mockOnValueChange}
      />
    )

    const button = screen.getByRole('button')
    await user.click(button)

    const option = screen.getByRole('option', { name: 'Option 1' })
    await user.click(option)

    expect(mockOnValueChange).toHaveBeenCalledWith('option1')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes dropdown when pressing Escape', async () => {
    const user = userEvent.setup()
    render(
      <CustomDropdown
        label="Test Label"
        options={mockOptions}
        value="all"
        onValueChange={mockOnValueChange}
      />
    )

    const button = screen.getByRole('button')
    await user.click(button)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('has proper ARIA attributes for accessibility', async () => {
    const user = userEvent.setup()
    render(
      <CustomDropdown
        label="Test Label"
        options={mockOptions}
        value="option1"
        onValueChange={mockOnValueChange}
      />
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    const selectedOption = screen.getByRole('option', { name: 'Option 1' })
    expect(selectedOption).toHaveAttribute('aria-selected', 'true')
  })
})
