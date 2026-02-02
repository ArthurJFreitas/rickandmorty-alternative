import type { Character } from '@/services/graphql/types'
import type { LocationData } from '@/components/organisms/LocationChart'

export const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  },
  {
    id: '2',
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  },
  {
    id: '3',
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Female',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
  },
  {
    id: '4',
    name: 'Beth Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Female',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
  },
  {
    id: '5',
    name: 'Jerry Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: {
      id: '1',
      name: 'Earth (C-137)',
    },
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
  },
]

export const mockLocationData: LocationData[] = [
  { name: 'Earth (C-137)', count: 27 },
  { name: 'Abadango', count: 1 },
  { name: 'Citadel of Ricks', count: 101 },
  { name: 'Worldender\'s lair', count: 3 },
  { name: 'Anatomy Park', count: 11 },
  { name: 'Interdimensional Cable', count: 5 },
  { name: 'Immortality Field Resort', count: 8 },
  { name: 'Post-Apocalyptic Earth', count: 15 },
]

export const mockCharactersResponse = {
  characters: {
    info: {
      count: 826,
      pages: 42,
      next: 2,
      prev: null,
    },
    results: mockCharacters,
  },
}

export const mockEmptyCharactersResponse = {
  characters: {
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
    results: [],
  },
}
