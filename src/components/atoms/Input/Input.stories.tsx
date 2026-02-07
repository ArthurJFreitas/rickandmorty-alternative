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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="name" style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label htmlFor="name-error" style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>
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
          <p style={{ fontSize: 14, color: '#ef4444' }}>{error}</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>Text</label>
        <Input type="text" placeholder="Enter text..." />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>Email</label>
        <Input type="email" placeholder="Enter email..." />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>Password</label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>Number</label>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 16, border: '1px solid #27272a', background: '#18181b', padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f4f4f5' }}>
          Create Character
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="char-name" style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>
            Name
          </label>
          <Input
            id="char-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Character name..."
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="char-email" style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="char-location" style={{ fontSize: 14, fontWeight: 600, color: '#d4d4d8' }}>
            Location
          </label>
          <Input
            id="char-location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Earth (C-137)"
          />
        </div>
        <div style={{ marginTop: 8, borderRadius: 12, background: '#111827', padding: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>Form Data:</p>
          <pre style={{ marginTop: 4, fontSize: 12, color: '#a1a1aa' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}
