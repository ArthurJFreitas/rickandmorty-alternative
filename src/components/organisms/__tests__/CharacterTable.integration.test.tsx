import { render, screen, waitFor } from '@/test-utils/test-utils'
import { CharacterTable } from '../CharacterTable'
import { useCharacterSearch } from '@/hooks/useCharacterSearch'
import { GET_CHARACTERS } from '@/services/graphql/queries/characters'
import '@testing-library/jest-dom'

const mockCharactersResponse = {
  request: {
    query: GET_CHARACTERS,
    variables: { page: 1, filter: undefined },
  },
  result: {
    data: {
      characters: {
        info: {
          count: 826,
          pages: 42,
          next: 2,
          prev: null,
          __typename: 'Info',
        },
        results: [
          {
            id: '1',
            name: 'Rick Sanchez',
            status: 'Alive',
            species: 'Human',
            gender: 'Male',
            origin: { id: '1', name: 'Earth (C-137)', __typename: 'Location' },
            location: { id: '20', name: 'Citadel of Ricks', __typename: 'Location' },
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            __typename: 'Character',
          },
          {
            id: '2',
            name: 'Morty Smith',
            status: 'Alive',
            species: 'Human',
            gender: 'Male',
            origin: { id: '1', name: 'Earth (C-137)', __typename: 'Location' },
            location: { id: '20', name: 'Citadel of Ricks', __typename: 'Location' },
            image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
            __typename: 'Character',
          },
          {
            id: '3',
            name: 'Summer Smith',
            status: 'Alive',
            species: 'Human',
            gender: 'Female',
            origin: { id: '20', name: 'Earth (Replacement Dimension)', __typename: 'Location' },
            location: { id: '20', name: 'Earth (Replacement Dimension)', __typename: 'Location' },
            image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
            __typename: 'Character',
          },
        ],
        __typename: 'Characters',
      },
    },
  },
}

function CharacterTableWithData() {
  const { characters, isLoading, hasNextPage, loadMore } = useCharacterSearch()

  return (
    <CharacterTable
      characters={characters}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      loadMore={loadMore}
    />
  )
}

describe('CharacterTable Integration', () => {
  it('fetches data and renders characters in the table', async () => {
    render(<CharacterTableWithData />, {
      mocks: [mockCharactersResponse],
    })

    expect(screen.getByText('Loading characters…')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading characters…')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    expect(screen.getByText('Summer Smith')).toBeInTheDocument()

    const aliveBadges = screen.getAllByText('Alive')
    expect(aliveBadges.length).toBe(3)

    const humanSpecies = screen.getAllByText('Human')
    expect(humanSpecies.length).toBe(3)

    expect(screen.getByAltText('Rick Sanchez avatar')).toBeInTheDocument()
    expect(screen.getByAltText('Morty Smith avatar')).toBeInTheDocument()
  })

  it('matches snapshot after data loads', async () => {
    const { container } = render(<CharacterTableWithData />, {
      mocks: [mockCharactersResponse],
    })

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    })

    expect(container.querySelector('table')).toMatchSnapshot()
  })
})
