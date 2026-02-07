import { useStore } from '@/stores/useStore'
import type { TabType } from '@/types'

const tabs: { id: TabType; label: string }[] = [
  { id: 'templates', label: '模板' },
  { id: 'custom', label: '自定义' },
  { id: 'favorites', label: '收藏' },
]

export default function TabNav() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid #2f3336',
        position: 'relative',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: 1,
            padding: '14px 0',
            background: 'transparent',
            border: 'none',
            color: activeTab === tab.id ? '#e7e9ea' : '#71767b',
            fontSize: '14px',
            fontWeight: activeTab === tab.id ? 600 : 400,
            cursor: 'pointer',
            position: 'relative',
            transition: 'color 0.2s ease',
          }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: '#1d9bf0',
                borderRadius: '3px 3px 0 0',
                animation: 'indicator 0.2s ease-out',
              }}
            />
          )}
        </button>
      ))}

      <style>
        {`
          @keyframes indicator {
            from { transform: scaleX(0.5); opacity: 0; }
            to { transform: scaleX(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}
