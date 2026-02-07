import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableRow, TableCell } from '../TableRow'
import { describe, it, expect, vi } from 'vitest'

describe('TableRow', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      expect(screen.getByText('Cell 1')).toBeInTheDocument()
      expect(screen.getByText('Cell 2')).toBeInTheDocument()
    })

    it('applies default variant', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')
      expect(row).toHaveClass('group', 'transition-colors')
    })

    it('applies subtle variant', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow variant="subtle">
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')
      expect(row).toHaveClass('group', 'transition-colors')
    })

    it('applies none variant', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow variant="none">
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')
      expect(row).toHaveClass('group', 'transition-colors')
    })


  })

  describe('Clickable behavior', () => {
    it('adds cursor-pointer class when clickable is true', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow clickable>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')
      expect(row).toHaveClass('cursor-pointer')
    })

    it('adds cursor-pointer and role when onClick is provided', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow onClick={() => { }}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')
      expect(row).toHaveClass('cursor-pointer')
      expect(row).toHaveAttribute('role', 'button')
      expect(row).toHaveAttribute('tabIndex', '0')
    })

    it('calls onClick when row is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      const { container } = render(
        <table>
          <tbody>
            <TableRow onClick={handleClick}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      )

      const row = container.querySelector('tr')!
      await user.click(row)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

  })

})

