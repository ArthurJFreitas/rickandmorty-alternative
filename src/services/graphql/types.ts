export interface Character {
  id: string
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type?: string
  gender: string
  origin: {
    id?: string
    name: string
    dimension?: string
  }
  location: {
    id?: string
    name: string
    dimension?: string
  }
  image: string
  episode?: Episode[]
  created?: string
}

export interface Episode {
  id: string
  name: string
  episode: string
}

export interface Location {
  id: string
  name: string
  type: string
  dimension: string
  residents: { id: string }[]
  created?: string
}

export interface PageInfo {
  count: number
  pages: number
  next: number | null
  prev: number | null
}

export interface CharactersResponse {
  characters: {
    info: PageInfo
    results: Character[]
  }
}

export interface CharacterResponse {
  character: Character
}

export interface LocationsResponse {
  locations: {
    info: PageInfo
    results: Location[]
  }
}

export interface LocationResponse {
  location: Location & {
    residents: Pick<Character, 'id' | 'name' | 'status' | 'image'>[]
  }
}

export interface FilterCharacter {
  name?: string
  status?: string
  species?: string
  type?: string
  gender?: string
}

export interface FilterLocation {
  name?: string
  type?: string
  dimension?: string
}
