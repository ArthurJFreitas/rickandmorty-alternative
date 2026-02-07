'use client'

import { useRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Spinner } from '@/components/atoms/Spinner'
import { CharacterTableRow } from '@/components/molecules/CharacterTableRow'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr'
import type { Character } from '@/services/graphql/types'
import { useInfiniteScroll, useScrollFade } from '@/hooks'

export type { Character }

const tableVariants = cva(
  'w-full overflow-hidden rounded-2xl border bg-zinc-900',
  {
    variants: {
      variant: {
        default: 'border-zinc-800',
        elevated: 'border-zinc-800 shadow-xl shadow-zinc-950/50',
        ghost: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

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
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
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
    className: 'has-scroll',
    dependencies: [characters.length],
  })

  if (isLoading && characters.length === 0) {
    return (
      <div className={cn(tableVariants({ variant }), 'flex items-center justify-center py-16', className)}>
        <div className="flex min-h-80 flex-col justify-center items-center text-center">
          <Spinner size="lg" label="Loading characters" />
          <p className="mt-4 text-sm text-zinc-400">
            Loading characters…
          </p>
        </div>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className={cn(tableVariants({ variant }), 'flex flex-col items-center justify-center py-16 min-h-40', className)}>
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <MagnifyingGlassIcon size={32} weight="duotone" className="text-zinc-500" />
        </div>
        <p className="text-zinc-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn(tableVariants({ variant }), className)}>
      <div ref={scrollContainerRef} className="table-scroll scroll-fade max-h-150 overflow-auto rounded-lg">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-zinc-800/90 backdrop-blur">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400',
                    alignClasses[header.align],
                    header.hideOnMobile && 'hidden lg:table-cell'
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody aria-live="polite" className="divide-y divide-zinc-800">
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
            className="flex items-center justify-center border-t border-zinc-800 py-6"
          >
            {loadMoreError ? (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-xl border border-red-800/50 bg-red-950/20 px-4 py-3">
                  <p className="text-sm font-medium text-red-400">
                    Failed to load more characters
                  </p>
                  <p className="mt-1 text-xs text-red-500">
                    {loadMoreError.message.includes('429') || loadMoreError.message.includes('rate')
                      ? 'API rate limit reached. Please wait a moment.'
                      : loadMoreError.message}
                  </p>
                </div>
                <button
                  onClick={loadMore}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                    'border-emerald-800/50 bg-emerald-950/20 text-emerald-400',
                    'hover:bg-emerald-950/30 hover:border-emerald-700/50',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/30'
                  )}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <Spinner size="sm" label="Loading more characters" />
                <span className="ml-3 text-sm text-zinc-400">
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
