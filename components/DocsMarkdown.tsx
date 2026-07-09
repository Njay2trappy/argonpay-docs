import Link from 'next/link'
import { createElement, Fragment, ReactNode } from 'react'
import { DocsCodeBlock, DocsCodeSnippet, DocsCodeTabs } from './DocsCodeBlock'

type DocsMarkdownProps = {
  content: string
}

type InlineCodeKind =
  | 'method-get'
  | 'method-post'
  | 'method-put'
  | 'method-patch'
  | 'method-delete'
  | 'url'
  | 'path'
  | 'mime'
  | 'status'
  | 'boolean'
  | 'number'
  | 'string'
  | 'identifier'
  | 'default'

function classifyInlineCode(value: string): InlineCodeKind {
  const trimmed = value.trim()
  const upper = trimmed.toUpperCase()

  if (upper === 'GET') return 'method-get'
  if (upper === 'POST') return 'method-post'
  if (upper === 'PUT') return 'method-put'
  if (upper === 'PATCH') return 'method-patch'
  if (upper === 'DELETE') return 'method-delete'

  if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) return 'url'
  if (/^\/[A-Za-z0-9_.:\-/{}$]+$/.test(trimmed)) return 'path'
  if (/^[a-z]+\/[a-z0-9.+-]+$/i.test(trimmed)) return 'mime'
  if (/^\d{3}$/.test(trimmed)) return 'status'
  if (/^(true|false|null)$/i.test(trimmed)) return 'boolean'
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return 'number'
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return 'string'
  }
  if (/^[A-Za-z_$][\w$]*$/.test(trimmed) || /^[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*$/.test(trimmed)) {
    return 'identifier'
  }

  return 'default'
}

function renderInlineCode(value: string, key: string): ReactNode {
  const kind = classifyInlineCode(value)
  const isUrl = kind === 'url'
  const className = `docs-inline-code is-${kind}`

  if (isUrl) {
    const href = value.startsWith('http') ? value : `https://${value}`
    return (
      <a key={key} href={href} className={className} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    )
  }

  return (
    <code key={key} className={className}>
      {value}
    </code>
  )
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\))|(`[^`]+`)|(https?:\/\/[^\s)`]+)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      const href = match[3]
      const label = match[2]
      const isInternal = href.startsWith('/')
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-a-${i}`} href={href}>
            {label}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-a-${i}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        )
      )
    } else if (match[4]) {
      nodes.push(renderInlineCode(match[4].slice(1, -1), `${keyPrefix}-c-${i}`))
    } else if (match[5]) {
      nodes.push(renderInlineCode(match[5], `${keyPrefix}-u-${i}`))
    } else if (match[6]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`}>{match[6].slice(2, -2)}</strong>
      )
    } else if (match[7]) {
      nodes.push(<em key={`${keyPrefix}-i-${i}`}>{match[7].slice(1, -1)}</em>)
    }

    lastIndex = match.index + match[0].length
    i += 1
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function parseTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null
  const splitRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim())

  const headers = splitRow(lines[0])
  const divider = lines[1]
  if (!/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(divider)) return null
  const rows = lines.slice(2).map(splitRow)
  return { headers, rows }
}

function detectExampleLanguage(headingText: string): string | null {
  const lower = headingText.toLowerCase()
  if (/\bjavascript\b|\bjs\b|\bnode\b/.test(lower)) return 'javascript'
  if (/\bpython\b|\bpy\b/.test(lower)) return 'python'
  if (/\btypescript\b|\bts\b/.test(lower)) return 'typescript'
  if (/\bgraphql\b|\bgql\b/.test(lower)) return 'graphql'
  if (/\bjson\b/.test(lower)) return 'json'
  return null
}

function readFence(
  lines: string[],
  startIndex: number
): { language: string; code: string; nextIndex: number } | null {
  const fence = lines[startIndex]?.match(/^```(\w+)?\s*$/)
  if (!fence) return null

  const language = (fence[1] || '').toLowerCase()
  const codeLines: string[] = []
  let i = startIndex + 1
  while (i < lines.length && !lines[i].startsWith('```')) {
    codeLines.push(lines[i])
    i += 1
  }
  if (i < lines.length) i += 1

  return {
    language,
    code: codeLines.join('\n'),
    nextIndex: i,
  }
}

function skipBlankAndRules(lines: string[], startIndex: number): number {
  let i = startIndex
  while (i < lines.length && (!lines[i].trim() || lines[i].trim() === '---')) {
    i += 1
  }
  return i
}

function collectLanguageExampleGroup(
  lines: string[],
  startIndex: number,
  firstHeadingText: string
): { snippets: DocsCodeSnippet[]; nextIndex: number } | null {
  const firstLang = detectExampleLanguage(firstHeadingText)
  if (!firstLang) return null

  let i = skipBlankAndRules(lines, startIndex + 1)
  const firstFence = readFence(lines, i)
  if (!firstFence) return null

  const snippets: DocsCodeSnippet[] = [
    {
      language: firstFence.language || firstLang,
      code: firstFence.code,
    },
  ]
  i = firstFence.nextIndex

  while (true) {
    const peek = skipBlankAndRules(lines, i)
    const heading = lines[peek]?.match(/^(#{1,6})\s+(.*)$/)
    if (!heading) break

    const nextLang = detectExampleLanguage(heading[2].trim())
    if (!nextLang) break

    const afterHeading = skipBlankAndRules(lines, peek + 1)
    const nextFence = readFence(lines, afterHeading)
    if (!nextFence) break

    snippets.push({
      language: nextFence.language || nextLang,
      code: nextFence.code,
    })
    i = nextFence.nextIndex
  }

  if (snippets.length < 2) return null
  return { snippets, nextIndex: i }
}

export default function DocsMarkdown({ content }: DocsMarkdownProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let blockIndex = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i += 1
      continue
    }

    if (line.trim() === '---') {
      blocks.push(<hr key={`hr-${blockIndex++}`} />)
      i += 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const headingText = heading[2].trim()
      const exampleGroup = collectLanguageExampleGroup(lines, i, headingText)
      if (exampleGroup) {
        blocks.push(
          <DocsCodeTabs key={`tabs-${blockIndex++}`} snippets={exampleGroup.snippets} />
        )
        i = exampleGroup.nextIndex
        continue
      }

      const level = Math.min(heading[1].length + 1, 6)
      blocks.push(
        createElement(
          `h${level}`,
          { key: `h-${blockIndex++}` },
          renderInline(headingText, `h${blockIndex}`)
        )
      )
      i += 1
      continue
    }

    const fence = readFence(lines, i)
    if (fence) {
      // Group consecutive python/javascript fences into tabs when they appear back-to-back.
      const snippets: DocsCodeSnippet[] = [
        { language: fence.language || 'text', code: fence.code },
      ]
      let cursor = fence.nextIndex
      while (true) {
        const peek = skipBlankAndRules(lines, cursor)
        const next = readFence(lines, peek)
        if (!next) break
        const current = snippets[snippets.length - 1].language
        const pair =
          (current === 'python' && next.language === 'javascript') ||
          (current === 'javascript' && next.language === 'python') ||
          (current === 'typescript' && next.language === 'javascript') ||
          (current === 'javascript' && next.language === 'typescript')
        if (!pair && snippets.length === 1) break
        if (
          !['python', 'javascript', 'typescript'].includes(next.language) ||
          snippets.some((snippet) => snippet.language === next.language)
        ) {
          break
        }
        snippets.push({ language: next.language, code: next.code })
        cursor = next.nextIndex
      }

      if (snippets.length > 1) {
        blocks.push(<DocsCodeTabs key={`tabs-${blockIndex++}`} snippets={snippets} />)
        i = cursor
      } else {
        blocks.push(
          <DocsCodeBlock
            key={`code-${blockIndex++}`}
            language={fence.language}
            code={fence.code}
          />
        )
        i = fence.nextIndex
      }
      continue
    }

    if (line.trim().startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i += 1
      }
      const table = parseTable(tableLines)
      if (table) {
        blocks.push(
          <div key={`table-${blockIndex++}`} className="docs-table-wrap">
            <table className="docs-table">
              <thead>
                <tr>
                  {table.headers.map((header, idx) => (
                    <th key={idx}>{renderInline(header, `th-${idx}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{renderInline(cell, `td-${rowIdx}-${cellIdx}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i += 1
      }
      blocks.push(
        <blockquote key={`q-${blockIndex++}`}>
          {renderInline(quoteLines.join(' '), `q${blockIndex}`)}
        </blockquote>
      )
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i += 1
      }
      blocks.push(
        <ul key={`ul-${blockIndex++}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i += 1
      }
      blocks.push(
        <ol key={`ol-${blockIndex++}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `li-${idx}`)}</li>
          ))}
        </ol>
      )
      continue
    }

    const paraLines: string[] = [line]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i])
      i += 1
    }

    blocks.push(
      <p key={`p-${blockIndex++}`}>
        {renderInline(paraLines.join(' '), `p${blockIndex}`)}
      </p>
    )
  }

  return (
    <div className="docs-markdown">
      {blocks.map((block, idx) => (
        <Fragment key={idx}>{block}</Fragment>
      ))}
    </div>
  )
}
