import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { CharacterTable } from '../CharacterTable'
import { mockCharacters } from '@/test-utils/mock-data'
import '@testing-library/jest-dom'

describe('CharacterTable', () => {
  const mockOnRowClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders table with characters', () => {
    render(<CharacterTable characters={mockCharacters} />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
  })

  it('shows loading spinner when loading with no data', () => {
    render(<CharacterTable characters={[]} isLoading={true} />)

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading characters…')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows empty state when no characters', () => {
    render(<CharacterTable characters={[]} />)

    expect(screen.getByText('No characters found')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', async () => {
    const user = userEvent.setup()
    render(
      <CharacterTable characters={mockCharacters} onRowClick={mockOnRowClick} />
    )

    const firstRow = screen.getByText('Rick Sanchez').closest('tr')
    if (firstRow) {
      await user.click(firstRow)
      expect(mockOnRowClick).toHaveBeenCalledWith(mockCharacters[0])
    }
  })
})
