import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import App from './App'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import cachePolicies from './cache'

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('library-user-token')
  const authHeader = token ? `Bearer ${token}` : ''

  return {
    headers: {
      ...headers,
      ...(authHeader && { authorization: authHeader }),
    },
  }
})

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}))

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: cachePolicies
  }),
  link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
