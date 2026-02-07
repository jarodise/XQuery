import { useState } from 'react'
import { useStore } from '@/stores/useStore'
import type { Language, TimeRange, MediaType, ExcludeType } from '@/types'

export default function QueryBuilder() {
    const { queryParams, setQueryParams } = useStore()
    const [keywordInput, setKeywordInput] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)

    const handleAddKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault()
            if (!queryParams.keywords.includes(keywordInput.trim())) {
                setQueryParams({
                    keywords: [...queryParams.keywords, keywordInput.trim()],
                })
            }
            setKeywordInput('')
        }
    }

    const removeKeyword = (kw: string) => {
        setQueryParams({
            keywords: queryParams.keywords.filter((k) => k !== kw),
        })
    }

    const toggleMediaType = (type: MediaType) => {
        const mediaType = queryParams.mediaType.includes(type)
            ? queryParams.mediaType.filter((t) => t !== type)
            : [...queryParams.mediaType, type]
        setQueryParams({ mediaType })
    }

    const toggleExclude = (type: ExcludeType) => {
        const exclude = queryParams.exclude.includes(type)
            ? queryParams.exclude.filter((t) => t !== type)
            : [...queryParams.exclude, type]
        setQueryParams({ exclude })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
            {/* Keywords */}
            <div>
                <label
                    style={{
                        display: 'block',
                        fontSize: '13px',
                        color: '#71767b',
                        marginBottom: '8px',
                        fontWeight: 500,
                    }}
                >
                    Keywords
                </label>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        padding: '8px',
                        background: '#000000',
                        border: '1px solid #2f3336',
                        borderRadius: '8px',
                        minHeight: '42px',
                    }}
                >
                    {queryParams.keywords.map((kw) => (
                        <span
                            key={kw}
                            style={{
                                background: '#1d9bf0',
                                color: '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            {kw}
                            <button
                                onClick={() => removeKeyword(kw)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    padding: 0,
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleAddKeyword}
                        placeholder="Add keywords..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#e7e9ea',
                            fontSize: '14px',
                            outline: 'none',
                            minWidth: '100px',
                        }}
                    />
                </div>
            </div>

            {/* Language & Time Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                    <label
                        htmlFor="language-select"
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#71767b',
                            marginBottom: '8px',
                        }}
                    >
                        Language
                    </label>
                    <select
                        id="language-select"
                        value={queryParams.language}
                        onChange={(e) => setQueryParams({ language: e.target.value as Language })}
                        style={{
                            width: '100%',
                            background: '#000000',
                            border: '1px solid #2f3336',
                            borderRadius: '8px',
                            color: '#e7e9ea',
                            padding: '8px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Languages</option>
                        <option value="zh-cn">Chinese</option>
                        <option value="en">English</option>
                        <option value="ja">Japanese</option>
                        <option value="es">Spanish</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="time-range-select"
                        style={{
                            display: 'block',
                            fontSize: '13px',
                            color: '#71767b',
                            marginBottom: '8px',
                        }}
                    >
                        Time Range
                    </label>
                    <select
                        id="time-range-select"
                        value={queryParams.timeRange}
                        onChange={(e) => setQueryParams({ timeRange: e.target.value as TimeRange })}
                        style={{
                            width: '100%',
                            background: '#000000',
                            border: '1px solid #2f3336',
                            borderRadius: '8px',
                            color: '#e7e9ea',
                            padding: '8px',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    >
                        <option value="all">Anytime</option>
                        <option value="1h">Last 1h</option>
                        <option value="4h">Last 4h</option>
                        <option value="12h">Last 12h</option>
                        <option value="24h">Last 24h</option>
                        <option value="7d">Last 7d</option>
                    </select>
                </div>
            </div>

            {/* Min Likes */}
            <div>
                <label
                    htmlFor="min-likes-range"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        color: '#71767b',
                        marginBottom: '8px',
                    }}
                >
                    <span>Min Likes</span>
                    <span style={{ color: '#1d9bf0', fontWeight: 600 }}>{queryParams.minFaves}</span>
                </label>
                <input
                    id="min-likes-range"
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={queryParams.minFaves}
                    onChange={(e) => setQueryParams({ minFaves: parseInt(e.target.value, 10) })}
                    style={{
                        width: '100%',
                        accentColor: '#1d9bf0',
                        cursor: 'pointer',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#71767b', marginTop: '4px' }}>
                    <span>0</span>
                    <span>5k</span>
                    <span>10k</span>
                </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d9bf0',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                }}
            >
                <span style={{ transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    ▼
                </span>
                Advanced Filters
            </button>

            {showAdvanced && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px', background: '#16181c', borderRadius: '8px', border: '1px solid #2f3336' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#71767b', marginBottom: '8px' }}>Media Type</span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e7e9ea', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={queryParams.mediaType.includes('images')}
                                    onChange={() => toggleMediaType('images')}
                                    style={{ accentColor: '#1d9bf0' }}
                                />
                                Images
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e7e9ea', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={queryParams.mediaType.includes('videos')}
                                    onChange={() => toggleMediaType('videos')}
                                    style={{ accentColor: '#1d9bf0' }}
                                />
                                Videos
                            </label>
                        </div>
                    </div>

                    <div>
                        <span style={{ display: 'block', fontSize: '12px', color: '#71767b', marginBottom: '8px' }}>Exclude</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e7e9ea', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={queryParams.exclude.includes('retweets')}
                                    onChange={() => toggleExclude('retweets')}
                                    style={{ accentColor: '#1d9bf0' }}
                                />
                                Retweets
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e7e9ea', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={queryParams.exclude.includes('replies')}
                                    onChange={() => toggleExclude('replies')}
                                    style={{ accentColor: '#1d9bf0' }}
                                />
                                Replies
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e7e9ea', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={queryParams.exclude.includes('links')}
                                    onChange={() => toggleExclude('links')}
                                    style={{ accentColor: '#1d9bf0' }}
                                />
                                Links
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
