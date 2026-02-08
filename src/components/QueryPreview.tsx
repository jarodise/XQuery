import { useEffect, useMemo, useState } from 'react'
import { useStore } from '@/stores/useStore'
import { buildQueryString } from '@/utils/queryBuilder'
import { executeSearch } from '@/utils/xSearch'

export default function QueryPreview() {
    const { queryParams, addFavorite } = useStore()
    const generatedQuery = useMemo(() => buildQueryString(queryParams), [queryParams])
    const [editableQuery, setEditableQuery] = useState(generatedQuery)

    useEffect(() => {
        setEditableQuery(generatedQuery)
    }, [generatedQuery])

    const finalQuery = editableQuery.trim()

    const handleSearch = () => {
        executeSearch(finalQuery)
    }

    const handleSave = () => {
        if (!finalQuery) return
        const name = window.prompt('Enter a name for this search:', 'My Search')
        if (name) {
            addFavorite(name.trim(), finalQuery)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(finalQuery)
        // We could add a toast here if we had one
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
                    Query Preview (Editable)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => setEditableQuery(generatedQuery)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#8abddd',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '2px 8px',
                            borderRadius: '4px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                        Reset
                    </button>
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
            </div>

            <textarea
                aria-label="Editable query preview"
                value={editableQuery}
                onChange={(e) => setEditableQuery(e.target.value)}
                placeholder="No query generated"
                style={{
                    background: '#16181c',
                    border: '1px solid #2f3336',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '13px',
                    color: '#e7e9ea',
                    minHeight: '84px',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none',
                }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <button
                    onClick={handleSave}
                    disabled={!finalQuery}
                    style={{
                        background: 'transparent',
                        border: '1px solid #2f3336',
                        color: '#e7e9ea',
                        padding: '10px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: finalQuery ? 'pointer' : 'not-allowed',
                        opacity: finalQuery ? 1 : 0.5,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(231, 233, 234, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                    Save
                </button>
                <button
                    onClick={handleSearch}
                    disabled={!finalQuery}
                    style={{
                        background: '#1d9bf0',
                        border: 'none',
                        color: '#ffffff',
                        padding: '10px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: finalQuery ? 'pointer' : 'not-allowed',
                        opacity: finalQuery ? 1 : 0.5,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        if (finalQuery) e.currentTarget.style.background = '#1a8cd8'
                    }}
                    onMouseLeave={(e) => {
                        if (finalQuery) e.currentTarget.style.background = '#1d9bf0'
                    }}
                >
                    Search
                </button>
            </div>
        </div>
    )
}
