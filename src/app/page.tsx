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
import styles from './page.module.css'

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
      className={styles.statsCard}
    >
      <div className={styles.statsIcon}>
        {icon}
      </div>
      <div>
        <p className={styles.statsLabel}>{label}</p>
        <p className={styles.statsValue}>{value}</p>
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
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <Image src={Logo} alt="Rick and Morty Dashboard" fetchPriority='high' width={140} height={60} priority />
          </div>
        </div>
      </header>

      <main className={styles.main}>

        <div className={styles.mainInner}>
          <div className={styles.grid}>

            <section className={styles.statsGrid}>
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
                <Card variant="elevated" padding="none">
                  <CardHeader className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderRow}>
                      <div>
                        <CardTitle>Character Distribution by Location</CardTitle>
                        <CardDescription>
                          Where the loaded characters are currently located
                        </CardDescription>
                      </div>

                      <label className={styles.toggleLabel}>
                        <input
                          type="checkbox"
                          checked={showAllLocations}
                          onChange={(e) => setShowAllLocations(e.target.checked)}
                          className={styles.toggleInput}
                        />
                        <div className={styles.toggleBox}>
                          {showAllLocations ? <CheckIcon size={14} weight="bold" className={styles.toggleCheck} /> : <span className={styles.toggleCheckHidden} />}
                        </div>
                        <span className={styles.toggleText}>
                          Show all locations
                          <span className={styles.toggleSubtext}>
                            ({showAllLocations ? locationChartData.length : Math.min(6, locationChartData.length)}/{locationChartData.length})
                          </span>
                        </span>
                      </label>
                    </div>
                  </CardHeader>
                  <Suspense
                    fallback={
                      <div className={styles.chartFallback}>
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
                      className={styles.chartGhost}
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
                  <CardHeader className={styles.sectionHeader}>
                    <div className={styles.filters}>
                      <div>
                        <CardTitle>Characters</CardTitle>
                        <CardDescription>
                          Browse and search through all Rick and Morty characters
                        </CardDescription>
                      </div>
                      <div className={styles.filterRow}>

                        <div className={styles.searchBlock}>
                          <label className={styles.searchLabel}>
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
                        <div className={styles.filterWidth}>
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
                        <div className={styles.filterWidth}>
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
                    <div className={styles.errorBoxWrap}>
                      <div className={styles.errorBox}>
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
                      className={styles.tableGhost}
                    />
                  )}
                </Card>
              </section>
            </ErrorBoundary>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            Made with
            <span className={styles.heart}>❤️</span>
            by <span className={styles.author}>Arthur Freitas</span>
            <span className={styles.dot}>•</span>
            <span>{new Date().getFullYear()}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
