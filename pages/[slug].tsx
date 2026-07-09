import { GetStaticPaths, GetStaticProps } from 'next'
import DocsLayout from '../components/DocsLayout'
import { DOCS_PAGES, getDocsPage } from '../utils/docsData'

type DocsSlugPageProps = {
  slug: string
}

export default function DocsSlugPage({ slug }: DocsSlugPageProps) {
  const page = getDocsPage(slug)
  if (!page) return null
  return <DocsLayout page={page} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: DOCS_PAGES.map((page) => ({ params: { slug: page.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<DocsSlugPageProps> = async (context) => {
  const slug = context.params?.slug
  if (typeof slug !== 'string' || !getDocsPage(slug)) {
    return { notFound: true }
  }
  return {
    props: { slug },
  }
}
