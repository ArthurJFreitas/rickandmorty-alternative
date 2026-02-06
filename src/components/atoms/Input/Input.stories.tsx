import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error'],
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
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithValue: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('Rick Sanchez')
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter name..."
      />
    )
  },
}

export const WithLabel: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Character Name
        </label>
        <Input
          id="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter character name..."
        />
      </div>
    )
  },
}

export const WithError: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('')
    const error = value.length > 0 && value.length < 3 ? 'Name must be at least 3 characters' : undefined

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor="name-error" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Character Name
        </label>
        <Input
          id="name-error"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter character name..."
          variant={error ? 'error' : 'default'}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const SmallSize: Story = {
  args: {
    placeholder: 'Small input...',
    inputSize: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    placeholder: 'Large input...',
    inputSize: 'lg',
  },
}

export const DifferentTypes: Story = {
  args: {} as any,
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Text</label>
        <Input type="text" placeholder="Enter text..." />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email</label>
        <Input type="email" placeholder="Enter email..." />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Number</label>
        <Input type="number" placeholder="Enter number..." />
      </div>
    </div>
  ),
}

export const FormExample: Story = {
  args: {} as any,
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      location: '',
    })

    return (
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Create Character
        </h3>
        <div className="flex flex-col gap-2">
          <label htmlFor="char-name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Name
          </label>
          <Input
            id="char-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Character name..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="char-email" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <Input
            id="char-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="character@example.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="char-location" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Location
          </label>
          <Input
            id="char-location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Earth (C-137)"
          />
        </div>
        <div className="mt-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Form Data:</p>
          <pre className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}
