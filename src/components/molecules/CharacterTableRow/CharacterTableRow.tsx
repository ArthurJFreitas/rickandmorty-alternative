'use client'

import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { TableRow, TableCell } from '@/components/molecules/TableRow'
import type { Character } from '@/services/graphql/types'
import styles from './CharacterTableRow.module.css'

interface CharacterTableRowProps {
  character: Character
  onClick?: (character: Character) => void
}

const statusVariants: Record<Character['status'], 'success' | 'danger' | 'default'> = {
  Alive: 'success',
  Dead: 'danger',
  unknown: 'default',
}

export function CharacterTableRow({ character, onClick }: CharacterTableRowProps) {
  return (
    <TableRow onClick={onClick ? () => onClick(character) : undefined}>
      <TableCell align="center">
        <div className={styles.avatarCell}>
          <Avatar
            src={character.image}
            alt={`${character.name} avatar`}
            name={character.name}
            size="md"
          />
        </div>
      </TableCell>

      <TableCell>
        <div>
          <div className={styles.name}>
            {character.name}
          </div>
          <div className={styles.species}>
            {character.species}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={statusVariants[character.status]}>
          <span
            className={`${styles.statusDot} ${
              character.status === 'Alive'
                ? styles.statusAlive
                : character.status === 'Dead'
                ? styles.statusDead
                : styles.statusUnknown
            }`}
            data-testid="status-dot"
            data-status={character.status}
          />
          {character.status}
        </Badge>
      </TableCell>

      <TableCell hideOnMobile>
        <span className={styles.muted}>{character.gender}</span>
      </TableCell>

      <TableCell hideOnMobile>
        <span className={styles.muted}>{character.origin.name}</span>
      </TableCell>

      <TableCell hideOnMobile>
        <span className={styles.muted}>{character.location.name}</span>
      </TableCell>
    </TableRow>
  )
}
