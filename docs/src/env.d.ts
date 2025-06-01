declare module '*.mdx' {
  import type { FC } from 'react'
  import type { MDXComponents } from 'nextra/mdx-components'
  const ReactComponent: FC<{
    components?: MDXComponents
  }>
  export default ReactComponent
}