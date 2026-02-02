import { renderHook, waitFor, act } from '@testing-library/react'
import { useCharacterSearch } from '../useCharacterSearch'
import { MockedProvider } from '@apollo/client/testing/react'
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

describe('useCharacterSearch', () => {
  const mocks = [
    {
      request: {
        query: GET_CHARACTERS,
        variables: { page: 1, filter: undefined },
      },
      result: {
        data: mockCharactersResponse,
      },
    },
  ]

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks}>
      {children}
    </MockedProvider>
  )

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
    const errorMocks = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        error: new Error('Network error'),
      },
    ]

    const errorWrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={errorMocks} >
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useCharacterSearch(), {
      wrapper: errorWrapper,
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
    const emptyMocks = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: {
          data: mockEmptyResponse,
        },
      },
    ]

    const emptyWrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={emptyMocks}>
        {children}
      </MockedProvider>
    )

    const { result } = renderHook(() => useCharacterSearch(), {
      wrapper: emptyWrapper,
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
})
