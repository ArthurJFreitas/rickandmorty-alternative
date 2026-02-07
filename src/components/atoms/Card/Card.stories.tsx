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
      <div style={{ padding: 24 }}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <div style={{ display: 'grid', gap: 16 }}>
          <p style={{ color: '#a1a1aa' }}>
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
      <div style={{ padding: 24 }}>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with elevated shadow</CardDescription>
        </CardHeader>
        <p style={{ color: '#a1a1aa' }}>
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
      <p style={{ color: '#a1a1aa' }}>
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
        <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#f4f4f5' }}>Card with Medium Padding</h3>
        <p style={{ color: '#a1a1aa' }}>
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
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#064e3b', color: '#34d399' }}>
          <p style={{ fontSize: 12, color: '#a1a1aa' }}>Total Characters</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#a1a1aa' }}>Total Characters</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#f4f4f5' }}>826</p>
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
        <div style={{ borderBottom: '1px solid #27272a', padding: 24 }}>
          <CardHeader style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <CardTitle>Rick Sanchez</CardTitle>
              <Badge variant="success">Alive</Badge>
            </div>
            <CardDescription>Human • Male</CardDescription>
          </CardHeader>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#a1a1aa' }}>Origin:</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#d4d4d8' }}>Earth (C-137)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#a1a1aa' }}>Location:</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#d4d4d8' }}>Citadel of Ricks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#a1a1aa' }}>Episodes:</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#d4d4d8' }}>51</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #27272a', padding: 16 }}>
          <Button variant="primary" size="sm" style={{ width: '100%' }}>
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
