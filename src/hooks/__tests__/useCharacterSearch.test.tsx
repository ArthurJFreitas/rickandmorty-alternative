import { renderHook, waitFor, act } from '@testing-library/react'
import { useCharacterSearch } from '../useCharacterSearch'
import { MockLink, MockedResponse } from '@apollo/client/testing'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { GET_CHARACTERS } from '@/services/graphql/queries/characters'
import { ReactNode } from 'react'

const mockCharactersResponse = {
  characters: {
    info: {
      count: 826,
      pages: 42,
      next: 2,
      prev: null,
    },
    results: [
      {
        id: '1',
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)' },
        location: { name: 'Citadel of Ricks' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      },
      {
        id: '2',
        name: 'Morty Smith',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)' },
        location: { name: 'Citadel of Ricks' },
        image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      },
    ],
  },
}

const mockEmptyResponse = {
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

const mockNoMorePagesResponse = {
  characters: {
    info: {
      count: 2,
      pages: 1,
      next: null,
      prev: null,
    },
    results: mockCharactersResponse.characters.results,
  },
}

const createMockClient = (mocks: MockedResponse[]) => {
  const mockLink = new MockLink(mocks, { showWarnings: false })
  return new ApolloClient({
    link: mockLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })
}

const createWrapper = (mocks: MockedResponse[]) => {
  const client = createMockClient(mocks)
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>
  }
}

describe('useCharacterSearch', () => {
  const mocks: MockedResponse[] = [
    {
      request: {
        query: GET_CHARACTERS,
        variables: { page: 1 },
      },
      result: {
        data: mockCharactersResponse,
      },
    },
  ]

  const wrapper = createWrapper(mocks)

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    expect(result.current.characters).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.query).toBe('')
    expect(result.current.hasNextPage).toBe(false)
  })

  it('loads characters and sets hasNextPage correctly', async () => {
    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.characters).toHaveLength(2)
    expect(result.current.characters[0].name).toBe('Rick Sanchez')
    expect(result.current.hasNextPage).toBe(true)
    expect(result.current.pageInfo?.count).toBe(826)
  })

  it('debounces search query', async () => {
    const { result } = renderHook(
      () => useCharacterSearch({ debounceDelay: 300 }),
      { wrapper }
    )

    act(() => {
      result.current.setQuery('rick')
    })

    expect(result.current.query).toBe('rick')
    expect(result.current.debouncedQuery).toBe('')

    await waitFor(
      () => {
        expect(result.current.debouncedQuery).toBe('rick')
      },
      { timeout: 500 }
    )
  })

  it('handles query errors', async () => {
    const errorMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        error: new Error('Network error'),
      },
    ]

    const { result } = renderHook(() => useCharacterSearch(), {
      wrapper: createWrapper(errorMocks),
    })

    await waitFor(
      () => {
        expect(result.current.error).not.toBeNull()
      },
      { timeout: 2000 }
    )

    expect(result.current.characters).toEqual([])
  })

  it('handles empty results', async () => {
    const emptyMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: {
          data: mockEmptyResponse,
        },
      },
    ]

    const { result } = renderHook(() => useCharacterSearch(), {
      wrapper: createWrapper(emptyMocks),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.characters).toEqual([])
    expect(result.current.hasNextPage).toBe(false)
  })

  it('provides loadMore function', async () => {
    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.loadMore).toBeDefined()
    expect(typeof result.current.loadMore).toBe('function')
  })

  it('applies status filter correctly', async () => {
    const statusMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: { status: 'Alive' } },
        },
        result: {
          data: mockCharactersResponse,
        },
      },
    ]

    const { result } = renderHook(
      () => useCharacterSearch({ status: 'Alive' }),
      { wrapper: createWrapper(statusMocks) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.characters).toHaveLength(2)
  })

  it('applies gender filter correctly', async () => {
    const genderMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: { gender: 'Male' } },
        },
        result: {
          data: mockCharactersResponse,
        },
      },
    ]

    const { result } = renderHook(
      () => useCharacterSearch({ gender: 'Male' }),
      { wrapper: createWrapper(genderMocks) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.characters).toHaveLength(2)
  })

  it('ignores "all" filter values', async () => {
    const allFilterMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: {
          data: mockCharactersResponse,
        },
      },
    ]

    const { result } = renderHook(
      () => useCharacterSearch({ status: 'all', gender: 'all' }),
      { wrapper: createWrapper(allFilterMocks) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.characters).toHaveLength(2)
  })

  it('cancel clears query and aborts', async () => {
    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    act(() => {
      result.current.setQuery('Rick')
    })

    expect(result.current.query).toBe('Rick')

    act(() => {
      result.current.cancel()
    })

    expect(result.current.query).toBe('')
  })

  it('hasNextPage is false when no more pages available', async () => {
    const noMorePagesMocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: {
          data: mockNoMorePagesResponse,
        },
      },
    ]

    const { result } = renderHook(
      () => useCharacterSearch(),
      { wrapper: createWrapper(noMorePagesMocks) }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.hasNextPage).toBe(false)
  })

  it('respects enabled option', async () => {
    const { result } = renderHook(
      () => useCharacterSearch({ enabled: false }),
      { wrapper }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.characters).toEqual([])
  })

  it('retry function is callable', async () => {
    const { result } = renderHook(() => useCharacterSearch(), { wrapper })

    expect(typeof result.current.retry).toBe('function')

    act(() => {
      result.current.retry()
    })
  })

  it('uses custom debounce delay', async () => {
    const { result } = renderHook(
      () => useCharacterSearch({ debounceDelay: 500 }),
      { wrapper }
    )

    act(() => {
      result.current.setQuery('test')
    })

    expect(result.current.isDebouncing).toBe(true)

    await waitFor(
      () => {
        expect(result.current.debouncedQuery).toBe('test')
      },
      { timeout: 600 }
    )
  })
})
