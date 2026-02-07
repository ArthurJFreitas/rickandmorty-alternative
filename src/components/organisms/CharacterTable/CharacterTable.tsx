'use client'

import { useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Spinner } from '@/components/atoms/Spinner'
import { CharacterTableRow } from '@/components/molecules/CharacterTableRow'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'
import type { Character } from '@/services/graphql/types'
import { useInfiniteScroll, useScrollFade } from '@/hooks'
import styles from './CharacterTable.module.css'

export type { Character }

const tableVariants = cva(styles.tableWrapper, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
      ghost: styles.variantGhost,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface CharacterTableProps extends VariantProps<typeof tableVariants> {
  characters: Character[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (character: Character) => void
  hasNextPage?: boolean
  loadMore?: () => void
  loadMoreError?: Error | null
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  className?: string
}

const tableHeaders = [
  { label: '', align: 'center' as const, hideOnMobile: false },
  { label: 'Name', align: 'left' as const, hideOnMobile: false },
  { label: 'Status', align: 'left' as const, hideOnMobile: false },
  { label: 'Gender', align: 'left' as const, hideOnMobile: true },
  { label: 'Origin', align: 'left' as const, hideOnMobile: true },
  { label: 'Last Location', align: 'left' as const, hideOnMobile: true },
]

const alignClasses = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
}

export function CharacterTable({
  characters,
  isLoading = false,
  emptyMessage = 'No characters found',
  onRowClick,
  hasNextPage = false,
  loadMore,
  loadMoreError,
  scrollContainerRef: externalScrollRef,
  variant,
  className,
}: CharacterTableProps) {
  const internalScrollRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = externalScrollRef || internalScrollRef

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading,
    onLoadMore: loadMore || (() => {}),
    threshold: 0.1,
    enabled: !!loadMore,
  })

  useScrollFade({
    containerRef: scrollContainerRef,
    className: styles.hasScroll,
    dependencies: [characters.length],
  })

  if (isLoading && characters.length === 0) {
    return (
      <div className={cn(tableVariants({ variant }), styles.centerState, className)}>
        <div className={styles.centerContent}>
          <Spinner size="lg" label="Loading characters" />
          <p className={styles.centerText}>
            Loading characters…
          </p>
        </div>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className={cn(tableVariants({ variant }), styles.centerState, className)}>
        <div className={styles.centerContentSmall}>
          <div className={styles.iconCircle}>
            <MagnifyingGlassIcon size={32} weight="duotone" className={styles.iconMuted} />
          </div>
        </div>
        <p className={styles.centerText}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn(tableVariants({ variant }), className)}>
      <div
        ref={scrollContainerRef}
        className={cn(styles.scrollContainer, styles.scrollFade)}
      >
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    styles.headerCell,
                    alignClasses[header.align],
                    header.hideOnMobile && styles.hideOnMobile
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody aria-live="polite" className={cn(styles.body, styles.rowDivider)}>
            {characters.map((character) => (
              <CharacterTableRow
                key={character.id}
                character={character}
                onClick={onRowClick}
              />
            ))}
          </tbody>
        </table>

        {hasNextPage && loadMore ? (
          <div
            ref={infiniteScrollRef}
            className={styles.loadMore}
          >
            {loadMoreError ? (
              <div className={styles.loadMoreError}>
                <div className={styles.loadMoreErrorCard}>
                  <p className={styles.loadMoreErrorTitle}>
                    Failed to load more characters
                  </p>
                  <p className={styles.loadMoreErrorMessage}>
                    {loadMoreError.message.includes('429') || loadMoreError.message.includes('rate')
                      ? 'API rate limit reached. Please wait a moment.'
                      : loadMoreError.message}
                  </p>
                </div>
                <button
                  onClick={loadMore}
                  className={styles.retryButton}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <Spinner size="sm" label="Loading more characters" />
                <span className={styles.loadMoreText}>
                  Loading more…
                </span>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { tableVariants }
