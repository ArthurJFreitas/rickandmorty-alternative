'use client'

import { useQuery } from '@apollo/client/react'
import { useParams, useRouter } from 'next/navigation'
import { GET_CHARACTER_BY_ID } from '@/services/graphql/queries/characters'
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { InlineError } from '@/components/organisms/ErrorBoundary'
import type { Character } from '@/services/graphql/types'
import Image from 'next/image'
import { ArrowLeftIcon, MapPinIcon, GlobeHemisphereWestIcon, TelevisionSimpleIcon, InfoIcon } from '@phosphor-icons/react/dist/ssr'
import styles from './page.module.css'

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
      <div className={styles.centered}>
        <div>
          <Spinner size="lg" label="Loading character" />
          <p className={styles.centeredText}>
            Loading character details...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorInner}>
          <InlineError error={error} onRetry={() => refetch()} />
          <div className={styles.errorActions}>
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
      <div className={styles.errorWrapper}>
        <div className={styles.errorInner}>
          <div className={styles.notFoundCard}>
            <h2 className={styles.notFoundTitle}>
              Character Not Found
            </h2>
            <p className={styles.notFoundText}>
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
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            size="sm"
            className={styles.backButton}
          >
            <ArrowLeftIcon size={16} weight="bold" />
            Back to Characters
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.layout}>
          <div className={styles.sidebarWrap}>
            <Card variant="elevated" padding="lg" className={styles.sidebar}>
              <div className={styles.imageWrap}>
                <Image
                  src={character.image}
                  alt={character.name}
                  width={300}
                  height={400}
                  className={styles.characterImage}
                />
              </div>

              <h1 className={styles.characterName}>
                {character.name}
              </h1>

              <div className={styles.statusRow}>
                <Badge variant={statusVariants[character.status]} size="lg">
                  <span
                    className={`${styles.statusDot} ${
                      character.status === 'Alive'
                        ? styles.statusAlive
                        : character.status === 'Dead'
                        ? styles.statusDead
                        : styles.statusUnknown
                    }`}
                  />
                  {character.status}
                </Badge>
              </div>

              <div className={styles.infoGroup}>
                <InfoRow label="Species" value={character.species} />
                {character.type && <InfoRow label="Type" value={character.type} />}
                <InfoRow label="Gender" value={character.gender} />
              </div>
            </Card>
          </div>

          <div className={styles.content}>
            <Card variant="elevated" padding="lg">
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.titleRow}>
                  <div className={styles.iconBadge}>
                    <MapPinIcon size={20} weight="duotone" />
                  </div>
                  Location Information
                </CardTitle>
              </CardHeader>

              <div className={styles.sectionList}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeaderRow}>
                    <GlobeHemisphereWestIcon size={16} weight="duotone" />
                    <h3 className={styles.sectionHeaderLabel}>
                      Origin
                    </h3>
                  </div>
                  <p className={styles.sectionValue}>
                    {character.origin.name}
                  </p>
                  {character.origin.dimension && (
                    <p className={styles.sectionSubValue}>
                      {character.origin.dimension}
                    </p>
                  )}
                </div>

                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeaderRow}>
                    <MapPinIcon size={16} weight="duotone" />
                    <h3 className={styles.sectionHeaderLabel}>
                      Last Known Location
                    </h3>
                  </div>
                  <p className={styles.sectionValue}>
                    {character.location.name}
                  </p>
                  {character.location.dimension && (
                    <p className={styles.sectionSubValue}>
                      {character.location.dimension}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {character.episode && character.episode.length > 0 && (
              <Card variant="elevated" padding="lg">
                <CardHeader className={styles.cardHeader}>
                  <CardTitle className={styles.titleRow}>
                    <div className={`${styles.iconBadge} ${styles.iconBadgePurple}`}>
                      <TelevisionSimpleIcon size={20} weight="duotone" />
                    </div>
                    Episodes ({character.episode.length})
                  </CardTitle>
                </CardHeader>

                <div className={styles.episodesGrid}>
                  {character.episode.slice(0, 10).map((episode) => (
                    <div
                      key={episode.id}
                      className={styles.episodeCard}
                    >
                      <div className={styles.episodeCode}>
                        {episode.episode}
                      </div>
                      <div className={styles.episodeName}>
                        {episode.name}
                      </div>
                    </div>
                  ))}
                </div>

                {character.episode.length > 10 && (
                  <p className={styles.moreEpisodes}>
                    + {character.episode.length - 10} more episodes
                  </p>
                )}
              </Card>
            )}

            <Card variant="elevated" padding="lg">
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.titleRow}>
                  <div className={`${styles.iconBadge} ${styles.iconBadgeAmber}`}>
                    <InfoIcon size={20} weight="duotone" />
                  </div>
                  Metadata
                </CardTitle>
              </CardHeader>

              <div className={styles.metaList}>
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
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>
        {label}
      </span>
      <span className={styles.infoValue}>
        {value}
      </span>
    </div>
  )
}
