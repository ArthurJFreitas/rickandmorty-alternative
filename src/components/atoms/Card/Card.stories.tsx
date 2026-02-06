import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription } from './Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost'],
      description: 'Card style variant',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Card padding',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Card content goes here. This is the main body of the card.
          </p>
          <Button size="sm">Action</Button>
        </div>
      </div>
    ),
    variant: 'default',
    padding: 'none',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Elevated: Story = {
  args: {
    children: (
      <div className="p-6">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with elevated shadow</CardDescription>
        </CardHeader>
        <p className="text-zinc-600 dark:text-zinc-400">
          This card has an elevated appearance with a more prominent shadow.
        </p>
      </div>
    ),
    variant: 'elevated',
    padding: 'none',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Ghost: Story = {
  args: {
    children: (
      <p className="text-zinc-600 dark:text-zinc-400">
        Ghost variant with minimal styling
      </p>
    ),
    variant: 'ghost',
    padding: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithPadding: Story = {
  args: {
    children: (
      <div>
        <h3 className="font-bold text-lg mb-2 dark:text-zinc-100">Card with Medium Padding</h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          This card has padding applied directly to the Card component.
        </p>
      </div>
    ),
    padding: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const StatCard: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    className: 'group hover:scale-105 transition-all duration-300',
    children: (
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Characters</p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Characters</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">826</p>
        </div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const CharacterCard: Story = {
  args: {
    variant: 'default',
    padding: 'none',
    children: (
      <>
        <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
          <CardHeader className="mb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Rick Sanchez</CardTitle>
              <Badge variant="success">Alive</Badge>
            </div>
            <CardDescription>Human • Male</CardDescription>
          </CardHeader>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Origin:</span>
              <span className="text-sm font-medium dark:text-zinc-300">Earth (C-137)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Location:</span>
              <span className="text-sm font-medium dark:text-zinc-300">Citadel of Ricks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Episodes:</span>
              <span className="text-sm font-medium dark:text-zinc-300">51</span>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '350px' }}>
        <Story />
      </div>
    ),
  ],
}
