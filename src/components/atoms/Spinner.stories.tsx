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
    <div className="flex gap-8 items-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Large</span>
      </div>
    </div>
  ),
}

export const InButton: Story = {
  args: {} as any,
  render: () => (
    <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
      <Spinner size="sm" />
      Loading...
    </button>
  ),
}

export const FullPageLoading: Story = {
  args: {} as any,
  render: () => (
    <div className="flex h-64 w-full items-center justify-center bg-zinc-950 rounded-lg">
      <Spinner size="lg" label="Loading content..." />
    </div>
  ),
}
