import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import App from './App'

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('library-user-token')
  const authHeader = token ? `Bearer ${token}` : undefined

  return {
    headers: {
      ...headers,
      ...(authHeader && { authorization: authHeader }),
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
