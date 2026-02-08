import type { SearchHistoryEntry } from '@/types'

interface HistoryItemProps {
  item: SearchHistoryEntry
  onClick: () => void
  onDelete: (id: string) => void
}

/**
 * Format a timestamp as a relative time string (e.g., "2m ago", "1h ago", "3d ago")
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'just now'
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  if (hours < 24) {
    return `${hours}h ago`
  }
  if (days < 7) {
    return `${days}d ago`
  }

  // For older entries, show the date
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * HistoryItem component displays a single search history entry
 * with the query text, relative timestamp, and delete button.
 */
export default function HistoryItem({ item, onClick, onDelete }: HistoryItemProps) {
  const relativeTime = formatRelativeTime(item.timestamp)

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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#1d9bf0'
        e.currentTarget.style.background = '#202327'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#2f3336'
        e.currentTarget.style.background = '#16181c'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '4px',
        }}
      >
        <code
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1d9bf0',
            wordBreak: 'break-all',
            fontFamily: 'inherit',
            flex: 1,
            marginRight: '8px',
          }}
        >
          {item.query}
        </code>
        <button
          aria-label="Delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item.id)
          }}
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
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f4212e'
            e.currentTarget.style.background = 'rgba(244, 33, 46, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#71767b'
            e.currentTarget.style.background = 'none'
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2H10.5C9.12 2 8 3.12 8 4.5V6H3V8H5V19C5 20.66 6.34 22 8 22H16C17.66 22 19 20.66 19 19V8H21V6H16ZM10 4.5C10 4.22 10.22 4 10.5 4H13.5C13.78 4 14 4.22 14 4.5V6H10V4.5ZM17 19C17 19.55 16.55 20 16 20H8C7.45 20 7 19.55 7 19V8H17V19Z" />
          </svg>
        </button>
      </div>
      <span
        style={{
          fontSize: '12px',
          color: '#71767b',
        }}
      >
        {relativeTime}
      </span>
    </div>
  )
}
