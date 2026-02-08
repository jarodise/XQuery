import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { executeSearch } from '@/utils/xSearch'
import ConfirmDialog from './ui/ConfirmDialog'
import HistoryItem from './HistoryItem'

export default function HistoryList() {
  const { searchHistory, clearSearchHistory, removeSearchHistoryItem } = useStore()
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleClearConfirm = (confirmed: boolean) => {
    if (confirmed) {
      clearSearchHistory()
    }
    setShowClearDialog(false)
  }

  const handleItemClick = (query: string) => {
    executeSearch(query)
  }

  if (searchHistory.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            marginBottom: '16px',
            color: '#2f3336',
          }}
        >
          🕐
        </div>
        <h3 style={{ fontSize: '18px', color: '#e7e9ea', marginBottom: '8px' }}>
          No search history yet
        </h3>
        <p style={{ fontSize: '14px', color: '#71767b' }}>
          Your search queries will appear here as you use the extension.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => setShowClearDialog(true)}
          style={{
            background: 'transparent',
            border: '1px solid #2f3336',
            color: '#71767b',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f4212e'
            e.currentTarget.style.color = '#f4212e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2f3336'
            e.currentTarget.style.color = '#71767b'
          }}
        >
          Clear all history
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {searchHistory.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item.query)}
            onDelete={removeSearchHistoryItem}
          />
        ))}
      </div>

      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={handleClearConfirm}
        title="Clear Search History"
        message="Are you sure you want to clear all search history? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  )
}
