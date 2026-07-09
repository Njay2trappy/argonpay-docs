import { Highlight, themes, type Language } from 'prism-react-renderer'
import { useMemo, useState } from 'react'
import DocsLangIcon from './DocsLangIcon'
import { useTheme } from '../utils/theme'

export type DocsCodeSnippet = {
  language: string
  code: string
}

type DocsCodeBlockProps = {
  language?: string
  code: string
  showToolbar?: boolean
}

type DocsCodeTabsProps = {
  snippets: DocsCodeSnippet[]
}

const LANGUAGE_ALIASES: Record<string, Language> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  py: 'python',
  python: 'python',
  gql: 'graphql',
  graphql: 'graphql',
  rust: 'rust',
  go: 'go',
  golang: 'go',
  json: 'json',
  bash: 'markup',
  sh: 'markup',
  shell: 'markup',
  nginx: 'markup',
  arduino: 'markup',
  http: 'markup',
  html: 'markup',
  xml: 'markup',
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  graphql: 'GraphQL',
  rust: 'Rust',
  go: 'Go',
  golang: 'Go',
  json: 'JSON',
  bash: 'Shell',
  nginx: 'HTTP',
  arduino: 'HTTP',
  clike: 'C-like',
  markup: 'Markup',
}

const argonLightCodeTheme = {
  ...themes.github,
  plain: {
    color: '#1f1f1f',
    backgroundColor: 'transparent',
  },
  styles: [
    ...themes.github.styles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6a737d', fontStyle: 'italic' as const },
    },
    {
      types: ['punctuation'],
      style: { color: '#6a6a6a' },
    },
    {
      types: ['property', 'tag', 'attr-name'],
      style: { color: '#0a7a3e' },
    },
    {
      types: ['boolean', 'number', 'constant', 'symbol', 'null'],
      style: { color: '#0550ae' },
    },
    {
      types: ['selector', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#0550ae' },
    },
    {
      types: ['operator', 'entity', 'url'],
      style: { color: '#9a6700' },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: { color: '#9a3412' },
    },
    {
      types: ['function', 'class-name'],
      style: { color: '#0550ae' },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: { color: '#a40e26' },
    },
  ],
}

const argonDarkCodeTheme = {
  ...themes.vsDark,
  plain: {
    color: '#e8e8e8',
    backgroundColor: 'transparent',
  },
  styles: [
    ...themes.vsDark.styles,
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#8b949e', fontStyle: 'italic' as const },
    },
    {
      types: ['punctuation'],
      style: { color: '#a0a0a0' },
    },
    {
      types: ['property', 'tag', 'attr-name'],
      style: { color: '#7ee787' },
    },
    {
      types: ['boolean', 'number', 'constant', 'symbol', 'null'],
      style: { color: '#79c0ff' },
    },
    {
      types: ['selector', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#a5d6ff' },
    },
    {
      types: ['operator', 'entity', 'url'],
      style: { color: '#ffd700' },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: { color: '#ff7b72' },
    },
    {
      types: ['function', 'class-name'],
      style: { color: '#d2a8ff' },
    },
    {
      types: ['regex', 'important', 'variable'],
      style: { color: '#ffa198' },
    },
  ],
}

function normalizeLanguage(language?: string): string {
  if (!language) return 'text'
  return language.trim().toLowerCase()
}

function resolvePrismLanguage(language?: string): Language {
  const normalized = normalizeLanguage(language)
  return LANGUAGE_ALIASES[normalized] ?? (normalized as Language)
}

function languageLabel(language?: string): string {
  const normalized = normalizeLanguage(language)
  if (LANGUAGE_LABELS[normalized]) return LANGUAGE_LABELS[normalized]
  if (!normalized || normalized === 'text') return 'Code'
  return normalized.toUpperCase()
}

function MacWindowControls() {
  return (
    <div className="docs-code-traffic" aria-hidden="true">
      <span className="docs-code-dot is-close" />
      <span className="docs-code-dot is-minimize" />
      <span className="docs-code-dot is-maximize" />
    </div>
  )
}

export function DocsCodeBlock({ language, code, showToolbar = true }: DocsCodeBlockProps) {
  const { resolved } = useTheme()
  const prismLanguage = resolvePrismLanguage(language)
  const label = languageLabel(language)
  const codeTheme = resolved === 'dark' ? argonDarkCodeTheme : argonLightCodeTheme

  return (
    <div className="docs-code" data-language={normalizeLanguage(language)}>
      <div className="docs-code-toolbar">
        <MacWindowControls />
        {showToolbar ? (
          <span className="docs-code-lang">
            <DocsLangIcon language={language || 'text'} size={12} />
            <span>{label}</span>
          </span>
        ) : (
          <span className="docs-code-lang is-plain">
            <span>{label}</span>
          </span>
        )}
        <span className="docs-code-toolbar-spacer" aria-hidden="true" />
      </div>
      <Highlight theme={codeTheme} code={code.replace(/\n$/, '')} language={prismLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`docs-code-pre ${className}`} style={style}>
            <code className="docs-code-code">
              {tokens.map((line, lineIndex) => (
                <div key={lineIndex} {...getLineProps({ line })}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export function DocsCodeTabs({ snippets }: DocsCodeTabsProps) {
  const { resolved } = useTheme()
  const codeTheme = resolved === 'dark' ? argonDarkCodeTheme : argonLightCodeTheme
  const tabs = useMemo(
    () =>
      snippets.map((snippet) => ({
        ...snippet,
        key: normalizeLanguage(snippet.language),
        label: languageLabel(snippet.language),
      })),
    [snippets]
  )

  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? 'text')
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0]

  if (!active) return null

  if (tabs.length === 1) {
    return <DocsCodeBlock language={active.language} code={active.code} />
  }

  return (
    <div className="docs-code docs-code-tabs" data-language={active.key}>
      <div className="docs-code-toolbar">
        <MacWindowControls />
        <div className="docs-code-tablist" role="tablist" aria-label="Code language">
          {tabs.map((tab) => {
            const isActive = tab.key === active.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`docs-code-tab${isActive ? ' is-active' : ''}`}
                onClick={() => setActiveKey(tab.key)}
              >
                <DocsLangIcon language={tab.key} size={12} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <span className="docs-code-toolbar-spacer" aria-hidden="true" />
      </div>
      <Highlight
        theme={codeTheme}
        code={active.code.replace(/\n$/, '')}
        language={resolvePrismLanguage(active.language)}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`docs-code-pre ${className}`} style={style} role="tabpanel">
            <code className="docs-code-code">
              {tokens.map((line, lineIndex) => (
                <div key={lineIndex} {...getLineProps({ line })}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
