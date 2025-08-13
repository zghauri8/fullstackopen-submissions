import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })
const authLink = setContext((_, { headers }) => {
const token = localStorage.getItem('library-user-token')
return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '' } }
})
const wsLink = new GraphQLWsLink(createClient({
url: 'ws://localhost:4000/graphql',
connectionParams: () => {
  const token = localStorage.getItem('library-user-token')
  return token ? { authorization: `Bearer ${token}` } : {}
}
}))
const splitLink = split(
({ query }) => {
const def = getMainDefinition(query)
return def.kind === 'OperationDefinition' && def.operation === 'subscription'
},
wsLink,
authLink.concat(httpLink)
)

const client = new ApolloClient({ link: splitLink, cache: new InMemoryCache() })

ReactDOM.createRoot(document.getElementById('root')).render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>
)