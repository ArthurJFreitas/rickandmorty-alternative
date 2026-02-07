import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { HeartIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Button visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
}

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const Loading: Story = {
  args: {
    children: 'Save',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <HeartIcon size={20} weight="fill" />
        Favorite
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    children: <MagnifyingGlassIcon size={20} />,
    size: 'icon',
  },
}

export const AllVariants: Story = {
  args: {} as any,
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button isLoading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="icon">
          <PlusIcon size={20} />
        </Button>
      </div>
    </div>
  ),
}
