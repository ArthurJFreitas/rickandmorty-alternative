import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Avatar size',
    },
    src: {
      control: 'text',
      description: 'Image URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for image',
    },
    name: {
      control: 'text',
      description: 'Name for fallback initial',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    alt: 'Rick Sanchez',
    name: 'Rick Sanchez',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    src: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    alt: 'Morty Smith',
    name: 'Morty Smith',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    src: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    alt: 'Summer Smith',
    name: 'Summer Smith',
    size: 'lg',
  },
}

export const Fallback: Story = {
  args: {
    src: '',
    alt: 'Beth Smith',
    name: 'Beth Smith',
    size: 'md',
  },
}

export const BrokenImage: Story = {
  args: {
    src: 'https://invalid-url.com/broken-image.jpg',
    alt: 'Jerry Smith',
    name: 'Jerry Smith',
    size: 'md',
  },
}

export const AllSizes: Story = {
  args: {} as any,
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
          alt="Rick Sanchez"
          name="Rick Sanchez"
          size="sm"
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          src="https://rickandmortyapi.com/api/character/avatar/2.jpeg"
          alt="Morty Smith"
          name="Morty Smith"
          size="md"
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          src="https://rickandmortyapi.com/api/character/avatar/3.jpeg"
          alt="Summer Smith"
          name="Summer Smith"
          size="lg"
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Large</span>
      </div>
    </div>
  ),
}

export const CharacterGallery: Story = {
  args: {} as any,
  render: () => (
    <div className="flex flex-wrap gap-3">
      {[
        { name: 'Rick Sanchez', id: 1 },
        { name: 'Morty Smith', id: 2 },
        { name: 'Summer Smith', id: 3 },
        { name: 'Beth Smith', id: 4 },
        { name: 'Jerry Smith', id: 5 },
        { name: 'Abadango Cluster Princess', id: 6 },
        { name: 'Abradolf Lincler', id: 7 },
        { name: 'Adjudicator Rick', id: 8 },
      ].map((character) => (
        <Avatar
          key={character.id}
          src={`https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg`}
          alt={character.name}
          name={character.name}
          size="md"
        />
      ))}
    </div>
  ),
}

export const FallbackInitials: Story = {
  args: {} as any,
  render: () => (
    <div className="flex flex-wrap gap-3">
      {[
        'Rick Sanchez',
        'Morty Smith',
        'Summer Smith',
        'Beth Smith',
        'Jerry Smith',
        'Evil Morty',
        'Birdperson',
        'Squanchy',
      ].map((name) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Avatar
            src=""
            alt={name}
            name={name}
            size="md"
          />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  ),
}
