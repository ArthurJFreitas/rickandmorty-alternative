import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SearchInput } from './SearchInput'

const meta = {
  title: 'Molecules/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'error'],
      description: 'Input style variant',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        placeholder="Search characters..."
      />
    )
  },
}

export const Elevated: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        variant="elevated"
        placeholder="Search with shadow..."
      />
    )
  },
}

export const WithValue: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('Rick Sanchez')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        placeholder="Search characters..."
      />
    )
  },
}

export const WithError: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        error="Please enter at least 3 characters"
        placeholder="Search characters..."
      />
    )
  },
}

export const SmallSize: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        inputSize="sm"
        placeholder="Small search..."
      />
    )
  },
}

export const LargeSize: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <SearchInput
        value={value}
        onValueChange={setValue}
        inputSize="lg"
        placeholder="Large search..."
      />
    )
  },
}

export const AllStates: Story = {
  args: {} as any,
  render: () => {
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState('Rick Sanchez')
    const [value3, setValue3] = useState('')

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Empty</h3>
          <SearchInput
            value={value1}
            onValueChange={setValue1}
            placeholder="Search..."
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">With Value</h3>
          <SearchInput
            value={value2}
            onValueChange={setValue2}
            placeholder="Search..."
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">With Error</h3>
          <SearchInput
            value={value3}
            onValueChange={setValue3}
            error="Search term is required"
            placeholder="Search..."
          />
        </div>
      </div>
    )
  },
}

export const Interactive: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    const [searchHistory, setSearchHistory] = useState<string[]>([])

    const handleClear = () => {
      if (value) {
        setSearchHistory([...searchHistory, value])
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <SearchInput
          value={value}
          onValueChange={setValue}
          onClear={handleClear}
          placeholder="Type to search..."
        />
        {searchHistory.length > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recent Searches:
            </p>
            <ul className="space-y-1">
              {searchHistory.map((term, index) => (
                <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400">
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
}
