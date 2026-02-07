'use client'

import { useQuery } from '@apollo/client/react'
import { useParams, useRouter } from 'next/navigation'
import { GET_CHARACTER_BY_ID } from '@/services/graphql/queries/characters'
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { InlineError } from '@/components/organisms/ErrorBoundary'
import { cn } from '@/lib/utils/style'
import type { Character } from '@/services/graphql/types'
import Image from 'next/image'
import { ArrowLeftIcon, MapPinIcon, GlobeHemisphereWestIcon, TelevisionSimpleIcon, InfoIcon } from '@phosphor-icons/react/dist/ssr'

interface CharacterByIdResponse {
  character: Character & {
    type: string
    episode: Array<{
      id: string
      name: string
      episode: string
    }>
    created: string
  }
}

const statusVariants: Record<Character['status'], 'success' | 'danger' | 'default'> = {
  Alive: 'success',
  Dead: 'danger',
  unknown: 'default',
}

export default function CharacterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const characterId = params?.id as string

  const { data, loading, error, refetch } = useQuery<CharacterByIdResponse>(
    GET_CHARACTER_BY_ID,
    {
      variables: { id: characterId },
      skip: !characterId,
    }
  )

  const character = data?.character

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-950 to-zinc-900">
        <div className="text-center">
          <Spinner size="lg" label="Loading character" />
          <p className="mt-4 text-zinc-400">
            Loading character details...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 p-8">
        <div className="mx-auto max-w-2xl">
          <InlineError error={error} onRetry={() => refetch()} />
          <div className="mt-4 text-center">
            <Button onClick={() => router.push('/')} variant="ghost">
              ← Back to Characters
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 to-zinc-900 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="mb-2 text-xl font-bold text-zinc-100">
              Character Not Found
            </h2>
            <p className="mb-4 text-zinc-400">
              The character you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push('/')} variant="primary">
              ← Back to Characters
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-950 to-zinc-900">
      <header className="border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Back to Characters
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-8">
              <div className="mb-6">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={300}
                  height={400}
                  className="h-full w-full rounded-xl object-cover shadow-lg"
                />
              </div>

              <h1 className="mb-2 text-3xl font-bold text-zinc-100">
                {character.name}
              </h1>

              <div className="mb-4 flex items-center gap-2">
                <Badge variant={statusVariants[character.status]} size="lg">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      character.status === 'Alive' && 'bg-emerald-500',
                      character.status === 'Dead' && 'bg-red-500',
                      character.status === 'unknown' && 'bg-zinc-400'
                    )}
                  />
                  {character.status}
                </Badge>
              </div>

              <div className="space-y-3 border-t border-zinc-800 pt-4">
                <InfoRow label="Species" value={character.species} />
                {character.type && <InfoRow label="Type" value={character.type} />}
                <InfoRow label="Gender" value={character.gender} />
              </div>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <Card variant="elevated" padding="lg">
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950 text-blue-400">
                    <MapPinIcon size={20} weight="duotone" />
                  </div>
                  Location Information
                </CardTitle>
              </CardHeader>

              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <GlobeHemisphereWestIcon size={16} weight="duotone" className="text-blue-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      Origin
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-zinc-100">
                    {character.origin.name}
                  </p>
                  {character.origin.dimension && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {character.origin.dimension}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPinIcon size={16} weight="duotone" className="text-blue-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      Last Known Location
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-zinc-100">
                    {character.location.name}
                  </p>
                  {character.location.dimension && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {character.location.dimension}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {character.episode && character.episode.length > 0 && (
              <Card variant="elevated" padding="lg">
                <CardHeader className="mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-950 text-purple-400">
                      <TelevisionSimpleIcon size={20} weight="duotone" />
                    </div>
                    Episodes ({character.episode.length})
                  </CardTitle>
                </CardHeader>

                <div className="grid gap-3 sm:grid-cols-2">
                  {character.episode.slice(0, 10).map((episode) => (
                    <div
                      key={episode.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                    >
                      <div className="mb-1 text-xs font-semibold text-emerald-400">
                        {episode.episode}
                      </div>
                      <div className="text-sm font-medium text-zinc-100">
                        {episode.name}
                      </div>
                    </div>
                  ))}
                </div>

                {character.episode.length > 10 && (
                  <p className="mt-4 text-sm text-zinc-400">
                    + {character.episode.length - 10} more episodes
                  </p>
                )}
              </Card>
            )}

            <Card variant="elevated" padding="lg">
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-950 text-amber-400">
                    <InfoIcon size={20} weight="duotone" />
                  </div>
                  Metadata
                </CardTitle>
              </CardHeader>

              <div className="space-y-2 text-sm">
                <InfoRow label="Character ID" value={character.id} />
                <InfoRow
                  label="Created"
                  value={new Date(character.created).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-zinc-100">
        {value}
      </span>
    </div>
  )
}
