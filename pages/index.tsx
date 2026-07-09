import { GetStaticProps } from 'next'
import DocsLayout from '../components/DocsLayout'
import { DOCS_PAGES, getDocsPage } from '../utils/docsData'

type DocsIndexProps = {
  slug: string
}

export default function DocsIndex({ slug }: DocsIndexProps) {
  const page = getDocsPage(slug)
  if (!page) return null
  return <DocsLayout page={page} />
}

export const getStaticProps: GetStaticProps<DocsIndexProps> = async () => {
  return {
    props: {
      slug: DOCS_PAGES[0]?.slug ?? 'welcome',
    },
  }
}
