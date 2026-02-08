import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { executeSearch } from '@/utils/xSearch'
import ConfirmDialog from './ui/ConfirmDialog'

export default function FavoritesList() {
    const { favorites, removeFavorite } = useStore()
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDeleteConfirm = (confirmed: boolean) => {
        if (confirmed && deleteId) {
            removeFavorite(deleteId)
        }
        setDeleteId(null)
    }

    if (favorites.length === 0) {
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
                    🔖
                </div>
                <h3 style={{ fontSize: '18px', color: '#e7e9ea', marginBottom: '8px' }}>
                    No favorites yet
                </h3>
                <p style={{ fontSize: '14px', color: '#71767b' }}>
                    Build a query in the Custom tab and save it to see it here.
                </p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
            {favorites.map((fav) => (
                <div
                    key={fav.id}
                    onClick={() => executeSearch(fav.query)}
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
                        <h4
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#e7e9ea',
                                margin: 0,
                            }}
                        >
                            {fav.name}
                        </h4>
                        <button
                            aria-label="Delete"
                            onClick={(e) => {
                                e.stopPropagation()
                                setDeleteId(fav.id)
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
                    <code
                        style={{
                            display: 'block',
                            fontSize: '11px',
                            color: '#1d9bf0',
                            wordBreak: 'break-all',
                            background: 'rgba(29, 155, 240, 0.05)',
                            padding: '6px',
                            borderRadius: '6px',
                            marginTop: '8px',
                            fontFamily: 'inherit',
                        }}
                    >
                        {fav.query}
                    </code>
                </div>
            ))}
            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={handleDeleteConfirm}
                title="Delete Favorite"
                message="Are you sure you want to delete this favorite? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    )
}
