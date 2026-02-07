import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MockLink, MockedResponse } from '@apollo/client/testing'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { render } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { CharacterTable } from '../CharacterTable'
import { useCharacterSearch } from '@/hooks/useCharacterSearch'
import { GET_CHARACTERS } from '@/services/graphql/queries/characters'
import { mockCharacters, mockCharactersResponse } from '@/test-utils/mock-data'
import '@testing-library/jest-dom'

function createMockClient(mocks: MockedResponse[]) {
  return new ApolloClient({
    link: new MockLink(mocks, { showWarnings: false }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'no-cache' },
      query: { fetchPolicy: 'no-cache' },
    },
  })
}


function CharacterTableWithData({
  onRowClick,
  status,
  gender,
}: {
  onRowClick?: (character: { id: string; name: string }) => void
  status?: string
  gender?: string
}) {
  const {
    characters,
    isLoading,
    hasNextPage,
    loadMore,
    loadMoreError,
    debouncedQuery,
  } = useCharacterSearch({ debounceDelay: 0, minSearchLength: 0, status, gender })

  return (
    <CharacterTable
      characters={characters}
      isLoading={isLoading}
      onRowClick={onRowClick}
      hasNextPage={hasNextPage}
      loadMore={loadMore}
      loadMoreError={loadMoreError}
      emptyMessage={
        debouncedQuery
          ? `No characters match "${debouncedQuery}"`
          : 'No characters found'
      }
    />
  )
}

function renderWithApollo(mocks: MockedResponse[], ui: React.ReactElement) {
  const client = createMockClient(mocks)
  return render(
    <NuqsTestingAdapter>
      <ApolloProvider client={client}>{ui}</ApolloProvider>
    </NuqsTestingAdapter>
  )
}

describe('CharacterTable integration: data fetching → rendering', () => {
  const defaultMocks: MockedResponse[] = [
    {
      request: {
        query: GET_CHARACTERS,
        variables: { page: 1 },
      },
      result: { data: mockCharactersResponse },
    },
  ]

  it('fetches characters and renders them in the table', async () => {
    renderWithApollo(defaultMocks, <CharacterTableWithData />)

    expect(screen.getByText('Loading characters…')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    })

    expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    expect(screen.getByText('Summer Smith')).toBeInTheDocument()
    expect(screen.getByText('Beth Smith')).toBeInTheDocument()
    expect(screen.getByText('Jerry Smith')).toBeInTheDocument()

    expect(screen.getByRole('table')).toBeInTheDocument()

    const humanCells = screen.getAllByText('Human')
    expect(humanCells.length).toBe(mockCharacters.length)

    const aliveBadges = screen.getAllByText('Alive')
    expect(aliveBadges.length).toBe(mockCharacters.length)
  })

  it('renders correct character details (origin, location, gender)', async () => {
    renderWithApollo(defaultMocks, <CharacterTableWithData />)

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    })

    const origins = screen.getAllByText('Earth (C-137)')
    expect(origins.length).toBe(mockCharacters.length)

    const locations = screen.getAllByText('Earth (Replacement Dimension)')
    expect(locations.length).toBe(mockCharacters.length)

    const males = screen.getAllByText('Male')
    expect(males.length).toBe(3) // Rick, Morty, Jerry

    const females = screen.getAllByText('Female')
    expect(females.length).toBe(2) // Summer, Beth
  })

  it('shows empty state when the API returns no characters', async () => {
    const emptyMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: {
          data: {
            characters: {
              info: { count: 0, pages: 0, next: null, prev: null },
              results: [],
            },
          },
        },
      },
    ]

    renderWithApollo(emptyMocks, <CharacterTableWithData />)

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument()
    })

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('displays an error state when the GraphQL query fails', async () => {
    const errorMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        error: new Error('Network error'),
      },
    ]

    function WithErrorHandling() {
      const { characters, isLoading, error } = useCharacterSearch({
        debounceDelay: 0,
      })

      if (error) {
        return (
          <div role="alert">
            Failed to load characters: {error.message}
          </div>
        )
      }

      return <CharacterTable characters={characters} isLoading={isLoading} />
    }

    renderWithApollo(errorMocks, <WithErrorHandling />)

    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    expect(screen.getByText(/Failed to load characters/)).toBeInTheDocument()
  })

  it('passes the clicked character to the onRowClick handler', async () => {
    const handleRowClick = vi.fn()
    renderWithApollo(
      defaultMocks,
      <CharacterTableWithData onRowClick={handleRowClick} />
    )

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    })

    const user = userEvent.setup()
    const rickRow = screen.getByText('Rick Sanchez').closest('tr')!
    await user.click(rickRow)

    expect(handleRowClick).toHaveBeenCalledTimes(1)
    expect(handleRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', name: 'Rick Sanchez' })
    )
  })

  it('fetches with a status filter and renders filtered results', async () => {
    const filteredMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: { status: 'Alive' } },
        },
        result: { data: mockCharactersResponse },
      },
    ]

    renderWithApollo(
      filteredMocks,
      <CharacterTableWithData status="Alive" />
    )

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument()
    })

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getAllByText('Alive').length).toBe(mockCharacters.length)
  })

})
