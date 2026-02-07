import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the spinner',
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const WithLabel: Story = {
  args: {
    size: 'md',
    label: 'Loading characters...',
  },
}

export const AllSizes: Story = {
  args: {} as any,
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="sm" />
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>Small</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="md" />
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>Medium</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Spinner size="lg" />
        <span style={{ fontSize: 12, color: '#a1a1aa' }}>Large</span>
      </div>
    </div>
  ),
}

export const InButton: Story = {
  args: {} as any,
  render: () => (
    <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, background: '#10b981', padding: '8px 16px', color: '#fff', border: 'none' }}>
      <Spinner size="sm" />
      Loading...
    </button>
  ),
}

export const FullPageLoading: Story = {
  args: {} as any,
  render: () => (
    <div style={{ display: 'flex', height: 256, width: '100%', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', borderRadius: 12 }}>
      <Spinner size="lg" label="Loading content..." />
    </div>
  ),
}
