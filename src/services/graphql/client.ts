import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'https://rickandmortyapi.com/graphql',
  fetch: (uri, options) => {
    return fetch(uri, options)
  },
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          characters: {
            keyArgs: ['filter'],
            merge(existing, incoming, { args }) {
              if (!args?.page || args.page === 1) {
                return incoming
              }
              return {
                ...incoming,
                results: [...(existing?.results || []), ...incoming.results],
              }
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})
