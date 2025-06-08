import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: 'src/graphql/documents/*.graphql',
  generates: {
    'src/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
