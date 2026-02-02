import { render, screen } from '@/test-utils/test-utils'
import { LocationChart } from '../LocationChart'
import { mockLocationData } from '@/test-utils/mock-data'

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div className="recharts-responsive-container">{children}</div>
    ),
  }
})

describe('LocationChart', () => {
  it('renders chart with data and handles loading/empty states', () => {
    const { container, rerender } = render(<LocationChart data={mockLocationData} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument()

    rerender(<LocationChart data={[]} isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(container.querySelector('.recharts-responsive-container')).not.toBeInTheDocument()

    rerender(<LocationChart data={[]} />)
    expect(screen.getByText('No location data available')).toBeInTheDocument()
  })
})
