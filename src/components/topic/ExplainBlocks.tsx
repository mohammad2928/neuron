import type { ReactNode } from 'react'

export function ExplainSection({
  title,
  children,
  tone = 'default',
}: {
  title: string
  children: ReactNode
  tone?: 'default' | 'math' | 'simple' | 'why' | 'example'
}) {
  return (
    <section className={`explain-section tone-${tone}`}>
      <h3>{title}</h3>
      <div className="explain-body">{children}</div>
    </section>
  )
}

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
    </>
  )
}
