// When TypeScript encounters imports ending with .graphql, it treats them as modules exporting a DocumentNode.
declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}
