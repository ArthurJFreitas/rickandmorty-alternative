import { gql } from '@apollo/client'

export const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        origin {
          id
          name
        }
        location {
          id
          name
        }
        image
      }
    }
  }
`

export const GET_CHARACTER_BY_ID = gql`
  query GetCharacterById($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        id
        name
        dimension
      }
      location {
        id
        name
        dimension
      }
      image
      episode {
        id
        name
        episode
      }
      created
    }
  }
`
