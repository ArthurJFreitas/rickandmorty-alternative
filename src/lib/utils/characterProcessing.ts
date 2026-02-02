import type { Character } from '@/services/graphql/types'

export interface LocationData {
  name: string
  count: number
}

export function groupCharactersByLocation(characters: Character[]): LocationData[] {
  const locationMap = new Map<string, number>()

  characters.forEach((character) => {
    const locationName = character.location.name
    if (locationName && locationName !== 'unknown') {
      locationMap.set(locationName, (locationMap.get(locationName) || 0) + 1)
    }
  })

  const result = Array.from(locationMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return result
}
