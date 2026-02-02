import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
import { CheckCircleIcon, XCircleIcon, WarningCircleIcon, InfoIcon } from '@phosphor-icons/react'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'danger', 'warning', 'info'],
      description: 'Badge color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
}

export const Success: Story = {
  args: {
    children: 'Alive',
    variant: 'success',
  },
}

export const Danger: Story = {
  args: {
    children: 'Dead',
    variant: 'danger',
  },
}

export const Warning: Story = {
  args: {
    children: 'Unknown',
    variant: 'warning',
  },
}

export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <CheckCircleIcon size={14} weight="fill" />
        Success
      </>
    ),
    variant: 'success',
  },
}

export const CharacterStatus: Story = {
  args: {} as any,
  render: () => (
    <div className="flex gap-3 items-center flex-wrap">
      <Badge variant="success">
        <CheckCircleIcon size={14} weight="fill" />
        Alive
      </Badge>
      <Badge variant="danger">
        <XCircleIcon size={14} weight="fill" />
        Dead
      </Badge>
      <Badge variant="warning">
        <WarningCircleIcon size={14} weight="fill" />
        Unknown
      </Badge>
    </div>
  ),
}

export const AllVariants: Story = {
  args: {} as any,
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center flex-wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <div className="flex gap-3 items-center">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    </div>
  ),
}
