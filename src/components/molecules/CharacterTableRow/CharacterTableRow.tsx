'use client'

import { Badge } from '@/components/atoms/Badge'
import { Avatar } from '@/components/atoms/Avatar'
import { TableRow, TableCell } from '@/components/molecules/TableRow'
import { cn } from '@/lib/utils/style'
import type { Character } from '@/services/graphql/types'

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
        <div className="flex items-center justify-center">
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
          <div className="font-semibold text-zinc-100">
            {character.name}
          </div>
          <div className="text-sm text-zinc-400">
            {character.species}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={statusVariants[character.status]}>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              character.status === 'Alive' && 'bg-emerald-500',
              character.status === 'Dead' && 'bg-red-500',
              character.status === 'unknown' && 'bg-zinc-400'
            )}
          />
          {character.status}
        </Badge>
      </TableCell>

      <TableCell hideOnMobile>
        <span className="text-zinc-400">{character.gender}</span>
      </TableCell>

      <TableCell hideOnMobile>
        <span className="text-zinc-400">{character.origin.name}</span>
      </TableCell>

      <TableCell hideOnMobile>
        <span className="text-zinc-400">{character.location.name}</span>
      </TableCell>
    </TableRow>
  )
}
