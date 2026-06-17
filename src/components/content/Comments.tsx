'use client'

import * as React from 'react'

interface CommentsProps {
  mapping?: string
}

export function Comments({ mapping }: CommentsProps) {
  const [loaded, setLoaded] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO ?? ''
  const repoId = process.env.NEXT_PUBLIC_GITHUB_REPO_ID ?? ''
  const category = process.env.NEXT_PUBLIC_GITHUB_CATEGORY ?? ''

  React.useEffect(() => {
    if (!repo || !repoId || !containerRef.current) return

    // Avoid duplicate script injection
    if (containerRef.current.querySelector('iframe.giscus-frame')) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-mapping', mapping ?? 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark_dimmed' : 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.crossOrigin = 'anonymous'
    script.async = true

    script.onload = () => setLoaded(true)

    containerRef.current.appendChild(script)

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const iframe = containerRef.current?.querySelector<HTMLIFrameElement>(
        'iframe.giscus-frame',
      )
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: document.documentElement.classList.contains('dark') ? 'dark_dimmed' : 'light' } } },
          'https://giscus.app',
        )
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [repo, repoId, category, mapping])

  if (!repo || !repoId) {
    return null
  }

  return (
    <div className="my-8">
      <div
        ref={containerRef}
        className="min-h-[200px]"
        aria-label="评论区"
      />
      {!loaded && (
        <div className="flex items-center justify-center h-[200px] rounded-lg border border-dashed border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            加载评论中…
          </div>
        </div>
      )}
    </div>
  )
}
