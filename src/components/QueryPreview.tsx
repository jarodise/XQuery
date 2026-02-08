import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import { buildQueryString } from '@/utils/queryBuilder'
import { executeSearch } from '@/utils/xSearch'
import { sanitizeName, isValidQueryString } from '@/utils/sanitize'
import InputDialog from './ui/InputDialog'
import Toast from './ui/Toast'

export default function QueryPreview() {
    const { queryParams, addFavorite, addSearchHistory } = useStore()
    const query = buildQueryString(queryParams)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const handleSearch = () => {
        addSearchHistory(query, queryParams)
        executeSearch(query)
    }

    const handleSave = () => {
        if (!isValidQueryString(query)) {
            return
        }
        setIsDialogOpen(true)
    }

    const handleDialogClose = (value: string | null) => {
        setIsDialogOpen(false)
        const sanitizedName = sanitizeName(value)
        if (sanitizedName) {
            addFavorite(sanitizedName, query)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(query)
        setToastMessage('Copied to clipboard!')
        setTimeout(() => setToastMessage(null), 2000)
    }

    return (
        <div
            style={{
                padding: '16px',
                borderTop: '1px solid #2f3336',
                background: '#000000',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                }}
            >
                <span style={{ fontSize: '13px', color: '#71767b', fontWeight: 500 }}>
                    Query Preview
                </span>
                <button
                    onClick={copyToClipboard}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#1d9bf0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '2px 8px',
                        borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                    Copy
                </button>
            </div>

            <div
                style={{
                    background: '#16181c',
                    border: '1px solid #2f3336',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '13px',
                    color: '#e7e9ea',
                    wordBreak: 'break-all',
                    minHeight: '40px',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                }}
            >
                {query || <span style={{ color: '#71767b', fontStyle: 'italic' }}>No query generated</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <button
                    onClick={handleSave}
                    style={{
                        background: 'transparent',
                        border: '1px solid #2f3336',
                        color: '#e7e9ea',
                        padding: '10px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231, 233, 234, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                    Save
                </button>
                <button
                    onClick={handleSearch}
                    disabled={!query}
                    style={{
                        background: '#1d9bf0',
                        border: 'none',
                        color: '#ffffff',
                        padding: '10px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: query ? 'pointer' : 'not-allowed',
                        opacity: query ? 1 : 0.5,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        if (query) e.currentTarget.style.background = '#1a8cd8'
                    }}
                    onMouseLeave={(e) => {
                        if (query) e.currentTarget.style.background = '#1d9bf0'
                    }}
                >
                    Search
                </button>
            </div>
            <InputDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                title="Save to Favorites"
                defaultValue="My Search"
                placeholder="Enter a name for this search"
                maxLength={100}
            />
            {toastMessage && <Toast message={toastMessage} type="success" duration={2000} />}
        </div>
    )
}
