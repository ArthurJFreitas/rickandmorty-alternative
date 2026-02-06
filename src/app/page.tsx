'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState, useRef, useEffect, lazy, Suspense, useCallback } from 'react'
import { SearchInput } from '@/components/molecules/SearchInput'
import { CustomDropdown } from '@/components/molecules/CustomDropdown'
import { CharacterTable, type Character } from '@/components/organisms/CharacterTable'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card'
import { useCharacterSearch } from '@/hooks'
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary'
import { groupCharactersByLocation } from '@/lib/utils/characterProcessing'
import { Spinner } from '@/components/atoms/Spinner'
import Logo from '@/assets/logo.png'
import Image from 'next/image'
import { UsersThreeIcon, MapPinIcon, DatabaseIcon, FilesIcon, HeartIcon, UserIcon } from '@phosphor-icons/react/dist/ssr'
import { CheckIcon } from '@phosphor-icons/react'
import { parseAsString, useQueryState } from 'nuqs'

const LocationChart = lazy(() => import('@/components/organisms/LocationChart').then(mod => ({ default: mod.LocationChart })))

function StatsCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card
      variant="elevated"
      padding="md"
      className="group flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 dark:bg-emerald-950 dark:text-emerald-400 dark:group-hover:bg-emerald-600">
        {icon}
      </div>
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useQueryState(
    'status',
    parseAsString.withDefault('all').withOptions({
      throttleMs: 300,
      shallow: false,
    })
  )
  const [genderFilter, setGenderFilter] = useQueryState(
    'gender',
    parseAsString.withDefault('all').withOptions({
      throttleMs: 500,
      shallow: false,
    })
  )

  const [showAllLocations, setShowAllLocations] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const {
    query: searchQuery,
    debouncedQuery,
    setQuery: setSearchQuery,
    characters,
    pageInfo: charactersPageInfo,
    isLoading: isLoadingCharacters,
    error: charactersError,
    loadMore,
    loadMoreError,
    hasNextPage,
  } = useCharacterSearch({
    debounceDelay: 300,
    minSearchLength: 0,
    status: statusFilter,
    gender: genderFilter,
  })

  const locationChartData = useMemo(() => {
    return groupCharactersByLocation(characters)
  }, [characters])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [debouncedQuery])

  const handleRowClick = useCallback((character: Character) => {
    router.push(`/character/${character.id}`)
  }, [router])

  return (

      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-950 to-zinc-900">
        <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Image src={Logo} alt="Rick and Morty Dashboard" fetchPriority='high' width={140} height={40} priority />
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-auto'>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-8">

              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  label="Total Characters"
                  value={charactersPageInfo?.count ?? '—'}
                  icon={<UsersThreeIcon size={24} weight="duotone" />}
                />
                <StatsCard
                  label="Unique Locations"
                  value={locationChartData.length}
                  icon={<MapPinIcon size={24} weight="duotone" />}
                />
                <StatsCard
                  label="Loaded Characters"
                  value={characters.length}
                  icon={<DatabaseIcon size={24} weight="duotone" />}
                />
                <StatsCard
                  label="Pages Available"
                  value={charactersPageInfo?.pages ?? '—'}
                  icon={<FilesIcon size={24} weight="duotone" />}
                />
              </section>

              <ErrorBoundary>
                <section>
                  <Card variant="elevated" padding="none" className=''>
                    <CardHeader className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle>Character Distribution by Location</CardTitle>
                          <CardDescription>
                            Where the loaded characters are currently located
                          </CardDescription>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                          <input
                            type="checkbox"
                            checked={showAllLocations}
                            onChange={(e) => setShowAllLocations(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="relative h-5 w-5 rounded border-2 border-zinc-300 bg-white transition-all duration-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-500/30 dark:border-zinc-600 dark:bg-zinc-800 dark:peer-checked:border-emerald-400 dark:peer-checked:bg-emerald-500">
                            {showAllLocations ? <CheckIcon size={14} weight="bold" className="text-white shrink-0" /> : <span className="absolute inset-0 h-full w-full scale-0 text-white transition-transform duration-200 peer-checked:scale-100" />}
                          </div>
                          <span className="text-sm font-medium text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100 whitespace-nowrap">
                            Show all locations
                            <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
                              ({showAllLocations ? locationChartData.length : Math.min(6, locationChartData.length)}/{locationChartData.length})
                            </span>
                          </span>
                        </label>
                      </div>
                    </CardHeader>
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center p-6">
                          <Spinner size="lg" label="Loading chart" />
                        </div>
                      }
                    >
                      <LocationChart
                        key={`chart-${locationChartData.length}-${characters.length}`}
                        data={locationChartData}
                        isLoading={isLoadingCharacters && characters.length === 0}
                        variant="ghost"
                        size="md"
                        className="border-0 overflow-auto"
                        emptyMessage="Load characters to see location distribution"
                        showAllLocations={showAllLocations}
                      />
                    </Suspense>
                  </Card>
                </section>
              </ErrorBoundary>

              <ErrorBoundary>
                <section>
                  <Card variant="elevated" padding="none">
                    <CardHeader className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                      <div className="flex flex-col gap-4">
                        <div>
                          <CardTitle>Characters</CardTitle>
                          <CardDescription>
                            Browse and search through all Rick and Morty characters
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-3">

                          <div className="flex flex-1 flex-col gap-2 lg:min-w-0">
                            <label className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                              Search
                            </label>
                            <SearchInput
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                              placeholder="Search characters..."
                              aria-label="Search characters"
                              name="character-search"
                              autoComplete="off"
                              variant="elevated"
                            />
                          </div>
                          <div className="lg:w-56">
                            <CustomDropdown
                              label="Status"
                              value={statusFilter}
                              onValueChange={setStatusFilter}
                              icon={<HeartIcon size={18} weight="duotone" />}
                              options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'alive', label: 'Alive' },
                                { value: 'dead', label: 'Dead' },
                                { value: 'unknown', label: 'Unknown' },
                              ]}
                              variant="default"
                            />
                          </div>
                          <div className="lg:w-56">
                            <CustomDropdown
                              label="Gender"
                              value={genderFilter}
                              onValueChange={setGenderFilter}
                              icon={<UserIcon size={18} weight="duotone" />}
                              options={[
                                { value: 'all', label: 'All Genders' },
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'genderless', label: 'Genderless' },
                                { value: 'unknown', label: 'Unknown' },
                              ]}
                              variant="default"
                            />
                          </div>

                        </div>

                      </div>
                    </CardHeader>

                    {charactersError ? (
                      <div className="p-6">
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                          Failed to load characters: {charactersError.message}
                        </div>
                      </div>
                    ) : (
                      <CharacterTable
                        characters={characters}
                        isLoading={isLoadingCharacters}
                        onRowClick={handleRowClick}
                        hasNextPage={hasNextPage}
                        loadMore={loadMore}
                        loadMoreError={loadMoreError}
                        scrollContainerRef={scrollContainerRef}
                        variant="ghost"
                        emptyMessage={
                          debouncedQuery
                            ? `No characters match "${debouncedQuery}"`
                            : 'No characters found'
                        }
                        className="border-0"
                      />
                    )}
                  </Card>
                </section>
              </ErrorBoundary>
            </div>
          </div>
        </main>

        <footer className="border-t border-zinc-800/80 bg-zinc-900/80 backdrop-blur-lg py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-400 sm:px-6 lg:px-8">
            <p className="flex items-center justify-center gap-2">
              Made with
              <span className="text-red-500 animate-pulse">❤️</span>
              by <span className="font-semibold text-zinc-100">Arthur Freitas</span>
              <span className="text-zinc-600">•</span>
              <span>{new Date().getFullYear()}</span>
            </p>
          </div>
        </footer>
      </div>
  )
}
