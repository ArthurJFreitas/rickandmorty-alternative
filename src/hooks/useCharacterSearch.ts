import { useLazyQuery, useQuery } from '@apollo/client/react'
import { useCallback, useState, useEffect } from 'react'
import { GET_CHARACTERS } from '@/services/graphql/queries/characters'
import type { CharactersResponse, FilterCharacter } from '@/services/graphql/types'
import { useDebounce } from './useDebounce'
import { useAbortController } from './useAbortController'

interface UseCharacterSearchOptions {
  debounceDelay?: number
  minSearchLength?: number
  enabled?: boolean
  status?: string
  gender?: string
}

interface UseCharacterSearchReturn {
  query: string
  debouncedQuery: string
  setQuery: (query: string) => void
  characters: CharactersResponse['characters']['results']
  pageInfo: CharactersResponse['characters']['info'] | undefined
  isLoading: boolean
  isDebouncing: boolean
  error: Error | null
  loadMore: () => Promise<void>
  loadMoreError: Error | null
  hasNextPage: boolean
  cancel: () => void
  retry: () => void
}

export function useCharacterSearch(
  options: UseCharacterSearchOptions = {}
): UseCharacterSearchReturn {
  const {
    debounceDelay = 300,
    minSearchLength = 0,
    enabled = true,
    status,
    gender,
  } = options

  const [query, setQuery] = useState('')
  const [loadMoreError, setLoadMoreError] = useState<Error | null>(null)

  const { debouncedValue: debouncedQuery, isDebouncing } = useDebounce(query, {
    delay: debounceDelay,
  })
  const { abort, reset } = useAbortController()

  const isSearching = debouncedQuery.length >= minSearchLength && debouncedQuery.length > 0

  const buildFilter = useCallback(
    (nameQuery?: string): FilterCharacter | undefined => {
      const filter: FilterCharacter = {}
      if (nameQuery) filter.name = nameQuery
      if (status && status !== 'all') filter.status = status
      if (gender && gender !== 'all') filter.gender = gender
      return Object.keys(filter).length > 0 ? filter : undefined
    },
    [status, gender]
  )

  const {
    data: initialData,
    loading: initialLoading,
    error: initialError,
    fetchMore: initialFetchMore,
  } = useQuery<CharactersResponse>(GET_CHARACTERS, {
    variables: { page: 1, filter: buildFilter() },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    skip: !enabled || isSearching,
  })

  const [
    fetchCharacters,
    {
      data: searchData,
      loading: searchLoading,
      error: searchError,
      fetchMore: searchFetchMore,
    },
  ] = useLazyQuery<CharactersResponse>(GET_CHARACTERS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (!enabled || !isSearching) {
      return
    }

    const controller = reset()
    const filter = buildFilter(debouncedQuery)

    fetchCharacters({
      variables: { page: 1, filter },
      context: {
        fetchOptions: {
          signal: controller.signal,
        },
      },
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('Search error:', err)
      }
    })
  }, [debouncedQuery, enabled, isSearching, fetchCharacters, buildFilter, reset])

  const loadMore = useCallback(async () => {
    setLoadMoreError(null)

    try {
      if (isSearching && searchData) {
        const nextPage = searchData.characters.info.next
        const filter = buildFilter(debouncedQuery)

        if (nextPage && searchFetchMore) {
          await searchFetchMore({
            variables: { page: nextPage, filter },
          })
        }
      } else if (!isSearching && initialData) {
        const nextPage = initialData.characters.info.next
        const filter = buildFilter()

        if (nextPage && initialFetchMore) {
          await initialFetchMore({
            variables: { page: nextPage, filter },
          })
        }
      }
    } catch (err) {
      setLoadMoreError(
        err instanceof Error ? err : new Error('Failed to load more characters')
      )
    }
  }, [
    isSearching,
    searchData,
    initialData,
    debouncedQuery,
    searchFetchMore,
    initialFetchMore,
    buildFilter,
  ])

  const cancel = useCallback(() => {
    abort()
    setQuery('')
  }, [abort])

  const retry = useCallback(() => {
    setLoadMoreError(null)
    if (debouncedQuery) {
      const controller = reset()
      const filter = buildFilter(debouncedQuery)

      fetchCharacters({
        variables: { page: 1, filter },
        context: {
          fetchOptions: {
            signal: controller.signal,
          },
        },
      })
    }
  }, [debouncedQuery, fetchCharacters, buildFilter, reset])

  const characters = isSearching
    ? searchData?.characters.results || []
    : initialData?.characters.results || []

  const pageInfo = isSearching
    ? searchData?.characters.info
    : initialData?.characters.info

  const hasNextPage = !!pageInfo?.next

  const isLoading = isSearching ? searchLoading : initialLoading

  const error = isSearching ? searchError : initialError

  return {
    query,
    debouncedQuery,
    setQuery,
    characters,
    pageInfo,
    isLoading,
    isDebouncing,
    error: error ? (error instanceof Error ? error : new Error(String(error))) : null,
    loadMore,
    loadMoreError,
    hasNextPage,
    cancel,
    retry,
  }
}
