import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'
import Header from '@/components/Header'
import TabNav from '@/components/TabNav'
import TemplateList from '@/components/TemplateList'
import QueryBuilder from '@/components/QueryBuilder'
import QueryPreview from '@/components/QueryPreview'
import FavoritesList from '@/components/FavoritesList'
import HistoryList from '@/components/HistoryList'

interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { activeTab, loadFavorites, loadSearchHistory } = useStore()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    loadFavorites()
    loadSearchHistory()
  }, [loadFavorites, loadSearchHistory])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  return (
    <div
      style={{
        width: '380px',
        height: '100vh',
        backgroundColor: '#000000',
        borderLeft: '1px solid #2f3336',
        display: 'flex',
        flexDirection: 'column',
        animation: isClosing ? 'slideOut 0.2s ease-out forwards' : 'slideIn 0.3s ease-out',
        color: '#e7e9ea',
        fontFamily: "'JetBrains Mono', 'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `}
      </style>

      <Header onClose={handleClose} />
      <TabNav />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
        }}
      >
        {activeTab === 'templates' && <TemplateList />}
        {activeTab === 'custom' && <QueryBuilder />}
        {activeTab === 'favorites' && <FavoritesList />}
        {activeTab === 'history' && <HistoryList />}
      </div>

      {activeTab === 'custom' && <QueryPreview />}
    </div>
  )
}
