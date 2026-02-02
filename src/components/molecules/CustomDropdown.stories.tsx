import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CustomDropdown } from './CustomDropdown'
import { HeartIcon, UserIcon, MapPinIcon, GenderIntersexIcon } from '@phosphor-icons/react'

const meta = {
  title: 'Molecules/CustomDropdown',
  component: CustomDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated'],
      description: 'Dropdown style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Dropdown size',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CustomDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('all')
    return (
      <CustomDropdown
        label="Status"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'alive', label: 'Alive' },
          { value: 'dead', label: 'Dead' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    )
  },
}

export const WithIcon: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('all')
    return (
      <CustomDropdown
        label="Status"
        value={value}
        onValueChange={setValue}
        icon={<HeartIcon size={18} weight="duotone" />}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'alive', label: 'Alive' },
          { value: 'dead', label: 'Dead' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    )
  },
}

export const GenderFilter: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('all')
    return (
      <CustomDropdown
        label="Gender"
        value={value}
        onValueChange={setValue}
        icon={<GenderIntersexIcon size={18} weight="duotone" />}
        options={[
          { value: 'all', label: 'All Genders' },
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'genderless', label: 'Genderless' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    )
  },
}

export const LocationFilter: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('earth')
    return (
      <CustomDropdown
        label="Location"
        value={value}
        onValueChange={setValue}
        icon={<MapPinIcon size={18} weight="duotone" />}
        options={[
          { value: 'all', label: 'All Locations' },
          { value: 'earth', label: 'Earth (C-137)' },
          { value: 'citadel', label: 'Citadel of Ricks' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    )
  },
}

export const Elevated: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('all')
    return (
      <CustomDropdown
        label="Status"
        value={value}
        onValueChange={setValue}
        variant="elevated"
        icon={<HeartIcon size={18} weight="duotone" />}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'alive', label: 'Alive' },
          { value: 'dead', label: 'Dead' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    )
  },
}

export const SmallSize: Story = {
  args: {} as any,
  render: () => {
    const [value, setValue] = useState('all')
    return (
      <CustomDropdown
        label="Status"
        value={value}
        onValueChange={setValue}
        size="sm"
        icon={<HeartIcon size={16} weight="duotone" />}
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'alive', label: 'Alive' },
          { value: 'dead', label: 'Dead' },
        ]}
      />
    )
  },
}

export const MultipleDropdowns: Story = {
  args: {} as any,
  render: () => {
    const [status, setStatus] = useState('all')
    const [gender, setGender] = useState('all')
    const [location, setLocation] = useState('all')

    return (
      <div className="flex flex-col gap-4" style={{ width: '100%' }}>
        <CustomDropdown
          label="Status"
          value={status}
          onValueChange={setStatus}
          icon={<HeartIcon size={18} weight="duotone" />}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'alive', label: 'Alive' },
            { value: 'dead', label: 'Dead' },
            { value: 'unknown', label: 'Unknown' },
          ]}
        />
        <CustomDropdown
          label="Gender"
          value={gender}
          onValueChange={setGender}
          icon={<UserIcon size={18} weight="duotone" />}
          options={[
            { value: 'all', label: 'All Genders' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'genderless', label: 'Genderless' },
          ]}
        />
        <CustomDropdown
          label="Location"
          value={location}
          onValueChange={setLocation}
          icon={<MapPinIcon size={18} weight="duotone" />}
          options={[
            { value: 'all', label: 'All Locations' },
            { value: 'earth', label: 'Earth' },
            { value: 'citadel', label: 'Citadel' },
          ]}
        />

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Selected Filters:
          </p>
          <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Status: <span className="font-medium">{status}</span></li>
            <li>Gender: <span className="font-medium">{gender}</span></li>
            <li>Location: <span className="font-medium">{location}</span></li>
          </ul>
        </div>
      </div>
    )
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', minHeight: '600px' }}>
        <Story />
      </div>
    ),
  ],
}
