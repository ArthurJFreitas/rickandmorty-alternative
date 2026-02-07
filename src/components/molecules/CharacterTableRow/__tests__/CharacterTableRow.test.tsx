import { render, screen } from '@/test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { CharacterTableRow } from '../CharacterTableRow'
import { mockCharacters } from '@/test-utils/mock-data'
import '@testing-library/jest-dom'

describe('CharacterTableRow', () => {
  const mockOnClick = vi.fn()
  const testCharacter = mockCharacters[0]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders character data correctly', () => {
    render(
      <table>
        <tbody>
          <CharacterTableRow character={testCharacter} />
        </tbody>
      </table>
    )

    expect(screen.getByText(testCharacter.name)).toBeInTheDocument()
    expect(screen.getByText(testCharacter.species)).toBeInTheDocument()
    expect(screen.getByText(testCharacter.status)).toBeInTheDocument()
    expect(screen.getByAltText(`${testCharacter.name} avatar`)).toBeInTheDocument()
  })

  it('renders status badge with correct variant styling', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <CharacterTableRow character={{ ...testCharacter, status: 'Alive' }} />
        </tbody>
      </table>
    )
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'Alive')

    rerender(
      <table>
        <tbody>
          <CharacterTableRow character={{ ...testCharacter, status: 'Dead' }} />
        </tbody>
      </table>
    )
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'Dead')

    rerender(
      <table>
        <tbody>
          <CharacterTableRow character={{ ...testCharacter, status: 'unknown' }} />
        </tbody>
      </table>
    )
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-status', 'unknown')
  })

  it('handles click and keyboard navigation with proper accessibility', async () => {
    const user = userEvent.setup()
    render(
      <table>
        <tbody>
          <CharacterTableRow character={testCharacter} onClick={mockOnClick} />
        </tbody>
      </table>
    )

    const row = screen.getByText(testCharacter.name).closest('tr')
    expect(row).toHaveAttribute('role', 'button')
    expect(row).toHaveAttribute('tabindex', '0')

    if (row) {
      await user.click(row)
      expect(mockOnClick).toHaveBeenCalledWith(testCharacter)

      row.focus()
      await user.keyboard('{Enter}')
      expect(mockOnClick).toHaveBeenCalledTimes(2)
    }
  })
})
