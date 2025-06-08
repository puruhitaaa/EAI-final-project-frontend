import {
  ApolloClient,
  type ApolloClientOptions,
  HttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core'
import type { App, Plugin } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

const createHttpLink = () =>
  new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
  })

const createApolloClient = (_app: App) => {
  const cache = new InMemoryCache()

  const link = createHttpLink()

  const apolloConfig: ApolloClientOptions<NormalizedCacheObject> = { link, cache }

  return new ApolloClient(apolloConfig)
}

const createPlugin = () => {
  const plugin: Plugin = {
    install: (app: App) => {
      const apolloClient = createApolloClient(app)
      app.provide(DefaultApolloClient, apolloClient)
    },
  }

  return plugin
}

const apolloPlugin = createPlugin()

export { apolloPlugin }
