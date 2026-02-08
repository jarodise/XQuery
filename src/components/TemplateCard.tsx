import { useStore } from '@/stores/useStore'
import type { SearchTemplate } from '@/types'
import { categoryLabels } from '@/data/templates'

interface TemplateCardProps {
  template: SearchTemplate
  onClick: () => void
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  const { addFavorite } = useStore()

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    const name = window.prompt('Enter a name for this search:', template.name)
    if (name) {
      addFavorite(name.trim(), template.query)
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #2f3336',
        background: '#16181c',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#1d9bf0'
        e.currentTarget.style.background = '#202327'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#2f3336'
        e.currentTarget.style.background = '#16181c'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#e7e9ea',
            marginRight: '32px',
          }}
        >
          {template.name}
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            title="Save to favorites"
            style={{
              background: 'none',
              border: 'none',
              color: '#71767b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1d9bf0'
              e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#71767b'
              e.currentTarget.style.background = 'none'
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
            </svg>
          </button>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="#71767b"
            style={{ flexShrink: 0 }}
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
      </div>

      <p
        style={{
          fontSize: '12px',
          color: '#71767b',
          marginBottom: '8px',
          lineHeight: 1.4,
        }}
      >
        {template.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
        {template.category && (
          <span
            style={{
              fontSize: '10px',
              color: '#8ecdf8',
              border: '1px solid rgba(29, 155, 240, 0.45)',
              borderRadius: '999px',
              padding: '2px 6px',
              background: 'rgba(29, 155, 240, 0.12)',
            }}
          >
            {categoryLabels[template.category]}
          </span>
        )}
        {(template.tags ?? []).slice(0, 3).map((tag) => (
          <span
            key={`${template.id}-${tag}`}
            style={{
              fontSize: '10px',
              color: '#9aa3ab',
              border: '1px solid #2f3336',
              borderRadius: '999px',
              padding: '2px 6px',
              background: '#101317',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      <code
        style={{
          display: 'block',
          fontSize: '10px',
          color: '#1d9bf0',
          background: 'rgba(29, 155, 240, 0.08)',
          padding: '6px 10px',
          borderRadius: '6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        {template.query}
      </code>
    </div>
  )
}
