type DocsLangIconProps = {
  language: string
  size?: number
  className?: string
}

function normalizeLang(language: string): string {
  const value = language.trim().toLowerCase()
  if (value === 'js' || value === 'node') return 'javascript'
  if (value === 'ts') return 'typescript'
  if (value === 'py') return 'python'
  if (value === 'gql') return 'graphql'
  if (value === 'bash' || value === 'shell' || value === 'sh') return 'curl'
  return value
}

export default function DocsLangIcon({ language, size = 16, className }: DocsLangIconProps) {
  const lang = normalizeLang(language)
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    className: className || 'docs-lang-icon',
    'aria-hidden': true as const,
    focusable: false as const,
  }

  if (lang === 'javascript' || lang === 'typescript') {
    return (
      <svg {...props}>
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path
          d="M11.2 17.7c0 1.7-1 2.6-2.5 2.6-1.3 0-2.1-.7-2.5-1.5l1.4-.8c.2.4.5.7 1 .7.5 0 .8-.2.8-.9v-5.1h1.8v4.9Zm3.5 2.6c-1.6 0-2.6-.8-3.1-1.8l1.4-.8c.3.5.7.9 1.5.9.6 0 1-.3 1-.7 0-.5-.4-.7-1.1-1l-1.1-.5c-1.1-.5-1.8-1.2-1.8-2.5 0-1.3 1-2.3 2.6-2.3 1.1 0 2 .4 2.6 1.5l-1.3.9c-.3-.4-.6-.6-1.2-.6-.5 0-.8.3-.8.6 0 .4.3.6 1 .9l1.1.5c1.3.6 2 1.3 2 2.7 0 1.5-1.2 2.4-2.8 2.4Z"
          fill="#323330"
        />
      </svg>
    )
  }

  if (lang === 'python') {
    return (
      <svg {...props}>
        <path
          d="M12.1 2c-1.1 0-2.1.1-2.9.2-2.4.4-2.8 1.2-2.8 2.7v1.9h5.7v.6H5.3c-1.6 0-2.9 1-3.3 2.9-.5 2.1-.5 3.5 0 5.6.3 1.5 1.1 2.9 2.7 2.9h1.8v-2.1c0-1.5 1.3-2.9 2.9-2.9h5.6c1.4 0 2.5-1.2 2.5-2.6V4.9c0-1.4-1.2-2.4-2.5-2.7C14.1 2.1 13.1 2 12.1 2Zm-2.7 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9Z"
          fill="#3776AB"
        />
        <path
          d="M11.9 22c1.1 0 2.1-.1 2.9-.2 2.4-.4 2.8-1.2 2.8-2.7v-1.9h-5.7v-.6h7c1.6 0 2.9-1 3.3-2.9.5-2.1.5-3.5 0-5.6-.3-1.5-1.1-2.9-2.7-2.9h-1.8v2.1c0 1.5-1.3 2.9-2.9 2.9H9.2c-1.4 0-2.5 1.2-2.5 2.6v4.7c0 1.4 1.2 2.4 2.5 2.7 1.1.2 2.1.3 2.7.3Zm2.7-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9Z"
          fill="#FFD43B"
        />
      </svg>
    )
  }

  if (lang === 'graphql') {
    return (
      <svg {...props}>
        <path
          fill="#E10098"
          d="M4.1 16.1 12 20.7l7.9-4.6V7.9L12 3.3 4.1 7.9v8.2Zm1.7-7.2L12 5.2l6.2 3.7v7.2L12 19.8l-6.2-3.7V8.9Z"
        />
        <circle cx="12" cy="4.2" r="1.5" fill="#E10098" />
        <circle cx="12" cy="19.8" r="1.5" fill="#E10098" />
        <circle cx="4.5" cy="8.5" r="1.5" fill="#E10098" />
        <circle cx="19.5" cy="8.5" r="1.5" fill="#E10098" />
        <circle cx="4.5" cy="15.5" r="1.5" fill="#E10098" />
        <circle cx="19.5" cy="15.5" r="1.5" fill="#E10098" />
      </svg>
    )
  }

  if (lang === 'rust') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="11" fill="#000000" />
        <path
          fill="#F74C00"
          d="M12 4.2c.5 0 .9.1 1.3.3l.7-1.1 1.2.7-.4 1.2c.4.3.8.7 1.1 1.1l1.2-.3.7 1.2-1.1.6c.1.4.2.9.2 1.3h1.3v1.4H16.9c0 .5-.1.9-.2 1.3l1.1.6-.7 1.2-1.2-.3c-.3.4-.7.8-1.1 1.1l.4 1.2-1.2.7-.7-1.1c-.4.2-.8.3-1.3.3s-.9-.1-1.3-.3l-.7 1.1-1.2-.7.4-1.2c-.4-.3-.8-.7-1.1-1.1l-1.2.3-.7-1.2 1.1-.6c-.1-.4-.2-.9-.2-1.3H4.8V10.3H6.1c0-.5.1-.9.2-1.3l-1.1-.6.7-1.2 1.2.3c.3-.4.7-.8 1.1-1.1l-.4-1.2 1.2-.7.7 1.1c.4-.2.8-.3 1.3-.3Zm0 3.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 1.6a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z"
        />
      </svg>
    )
  }

  if (lang === 'go') {
    return (
      <svg {...props}>
        <rect width="24" height="24" rx="5" fill="#00ADD8" />
        <path
          fill="#FFFFFF"
          d="M5.2 10.2h1.1l.2.7h.1c.2-.5.7-.8 1.3-.8.9 0 1.5.6 1.5 1.6v2.8H8.1v-2.6c0-.5-.3-.8-.7-.8-.5 0-.8.3-.8.9v2.5H5.2v-4.3Zm5.1 0h1.3v.7h.1c.2-.5.7-.8 1.3-.8.9 0 1.5.6 1.5 1.6v2.8h-1.4v-2.6c0-.5-.3-.8-.7-.8-.5 0-.8.3-.8.9v2.5h-1.3v-4.3Zm5.8-.1c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5-2.5-1-2.5-2.5 1-2.5 2.5-2.5Zm0 1.2c-.6 0-1 .5-1 1.3s.4 1.3 1 1.3 1-.5 1-1.3-.4-1.3-1-1.3Z"
        />
        <circle cx="7.2" cy="8.4" r="0.55" fill="#FFFFFF" />
        <circle cx="12.4" cy="8.4" r="0.55" fill="#FFFFFF" />
      </svg>
    )
  }

  // cURL / shell
  return (
    <svg {...props}>
      <rect width="24" height="24" rx="5" fill="#1B1F23" />
      <path
        d="M6.5 8.2 10.2 12 6.5 15.8"
        stroke="#4ADE80"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12.2 15.8h5.3"
        stroke="#E5E7EB"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
