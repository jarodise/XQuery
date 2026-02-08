import { useMemo, useState } from 'react'
import { useStore } from '@/stores/useStore'
import type {
  ExcludeType,
  IncludeType,
  KeywordMode,
  Language,
  MediaType,
  TimeRange,
} from '@/types'

type KeywordField = 'keywords' | 'anyKeywords' | 'excludeKeywords' | 'customOperators'

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#9aa0a6',
  marginBottom: '8px',
  fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#000000',
  border: '1px solid #2f3336',
  borderRadius: '8px',
  color: '#e7e9ea',
  padding: '8px 10px',
  fontSize: '13px',
  outline: 'none',
}

const chipStyle: React.CSSProperties = {
  background: 'rgba(29, 155, 240, 0.2)',
  color: '#9ed7ff',
  padding: '3px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
}

const presetCards = [
  {
    id: 'quality',
    label: '高质量原创',
    apply: {
      minFaves: 300,
      exclude: ['retweets', 'replies', 'links'] as ExcludeType[],
      include: [] as IncludeType[],
    },
  },
  {
    id: 'customer',
    label: '品牌口碑',
    apply: {
      include: ['replies'] as IncludeType[],
      exclude: ['links'] as ExcludeType[],
      minReplies: 3,
      questionOnly: false,
    },
  },
  {
    id: 'resource',
    label: '资源挖掘',
    apply: {
      mediaType: ['links'] as MediaType[],
      minFaves: 20,
      minRetweets: 10,
      exclude: ['retweets'] as ExcludeType[],
    },
  },
  {
    id: 'visual',
    label: '图像爆款',
    apply: {
      mediaType: ['images'] as MediaType[],
      minFaves: 100,
      exclude: ['retweets'] as ExcludeType[],
      include: [],
    },
  },
]

function CleanAccount(input: string): string {
  return input.replace(/^@+/, '').trim()
}

export default function QueryBuilder() {
  const { queryParams, setQueryParams, resetQueryParams } = useStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [keywordInputs, setKeywordInputs] = useState<Record<KeywordField, string>>({
    keywords: '',
    anyKeywords: '',
    excludeKeywords: '',
    customOperators: '',
  })

  const summary = useMemo(() => {
    const blocks: string[] = []
    if (queryParams.keywords.length) {
      blocks.push(`必选词 ${queryParams.keywords.length}`)
    }
    if (queryParams.anyKeywords.length) {
      blocks.push(`任意词 ${queryParams.anyKeywords.length}`)
    }
    if (queryParams.excludeKeywords.length) {
      blocks.push(`排除词 ${queryParams.excludeKeywords.length}`)
    }
    if (queryParams.customOperators.length) {
      blocks.push(`自定义 ${queryParams.customOperators.length}`)
    }
    if (queryParams.minFaves > 0) blocks.push(`赞>=${queryParams.minFaves}`)
    if (queryParams.minRetweets > 0) blocks.push(`转推>=${queryParams.minRetweets}`)
    if (queryParams.minReplies > 0) blocks.push(`回复>=${queryParams.minReplies}`)
    return blocks.length ? blocks.join(' · ') : '请先添加关键词或筛选条件'
  }, [queryParams])

  const addToken = (field: KeywordField) => {
    const value = keywordInputs[field].trim()
    if (!value) return

    const existing = queryParams[field] as string[]
    if (!existing.includes(value)) {
      setQueryParams({ [field]: [...existing, value] } as any)
    }

    setKeywordInputs((prev) => ({ ...prev, [field]: '' }))
  }

  const removeToken = (field: KeywordField, token: string) => {
    const existing = queryParams[field] as string[]
    setQueryParams({ [field]: existing.filter((item) => item !== token) } as any)
  }

  const toggleMedia = (value: MediaType) => {
    const mediaType = queryParams.mediaType.includes(value)
      ? queryParams.mediaType.filter((item) => item !== value)
      : [...queryParams.mediaType, value]
    setQueryParams({ mediaType })
  }

  const toggleInclude = (value: IncludeType) => {
    const include = queryParams.include.includes(value)
      ? queryParams.include.filter((item) => item !== value)
      : [...queryParams.include, value]
    setQueryParams({ include })
  }

  const toggleExclude = (value: ExcludeType) => {
    const exclude = queryParams.exclude.includes(value)
      ? queryParams.exclude.filter((item) => item !== value)
      : [...queryParams.exclude, value]
    setQueryParams({ exclude })
  }

  const renderTokenInput = (
    field: KeywordField,
    label: string,
    placeholder: string,
    description: string,
    pillColor?: string
  ) => {
    const tokens = queryParams[field] as string[]

    return (
      <div>
        <div style={{ ...sectionTitleStyle, marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '11px', color: '#71767b', marginBottom: '6px' }}>{description}</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={keywordInputs[field]}
            onChange={(event) =>
              setKeywordInputs((prev) => ({ ...prev, [field]: event.target.value }))
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addToken(field)
              }
            }}
            placeholder={placeholder}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => addToken(field)}
            style={{
              border: '1px solid #2f3336',
              background: '#16181c',
              color: '#e7e9ea',
              borderRadius: '8px',
              padding: '0 12px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            添加
          </button>
        </div>

        {tokens.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {tokens.map((token) => (
              <span
                key={`${field}-${token}`}
                style={{
                  ...chipStyle,
                  background: pillColor ?? chipStyle.background,
                }}
              >
                {token}
                <button
                  onClick={() => removeToken(field, token)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    fontSize: '12px',
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px' }}>
      <div
        style={{
          background: '#101214',
          border: '1px solid #2f3336',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#71767b', marginBottom: '4px' }}>当前组合</div>
        <div style={{ fontSize: '12px', color: '#dbe0e3', lineHeight: 1.4 }}>{summary}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
        {presetCards.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setQueryParams(preset.apply as any)}
            style={{
              border: '1px solid #2f3336',
              background: '#16181c',
              borderRadius: '8px',
              padding: '8px',
              color: '#d6dbe0',
              fontSize: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          border: '1px solid #2f3336',
          borderRadius: '8px',
          background: '#0b0d10',
        }}
      >
        <div style={{ fontSize: '12px', color: '#98a2ad' }}>关键词逻辑</div>
        <select
          aria-label="Keyword mode"
          value={queryParams.keywordMode}
          onChange={(event) =>
            setQueryParams({ keywordMode: event.target.value as KeywordMode })
          }
          style={{ ...inputStyle, width: '130px', padding: '6px 8px', fontSize: '12px' }}
        >
          <option value="and">AND (都要包含)</option>
          <option value="or">OR (任意一个)</option>
        </select>
      </div>

      {renderTokenInput(
        'keywords',
        '必选关键词',
        '例如: AI, growth, iPhone',
        '可输入多个词，按 Enter 或点击添加',
        'rgba(29, 155, 240, 0.2)'
      )}

      {renderTokenInput(
        'anyKeywords',
        '任一关键词组',
        '例如: thread / tutorial / guide',
        '会自动生成 (A OR B OR C)',
        'rgba(39, 180, 99, 0.25)'
      )}

      {renderTokenInput(
        'excludeKeywords',
        '排除关键词',
        '例如: giveaway / airdrop',
        '会自动生成 -词，过滤垃圾信息',
        'rgba(214, 67, 67, 0.25)'
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
        <div>
          <div style={sectionTitleStyle}>from:用户</div>
          <input
            value={queryParams.fromAccount}
            onChange={(event) => setQueryParams({ fromAccount: CleanAccount(event.target.value) })}
            placeholder="elonmusk"
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>to:用户</div>
          <input
            value={queryParams.toAccount}
            onChange={(event) => setQueryParams({ toAccount: CleanAccount(event.target.value) })}
            placeholder="openai"
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>@提及用户</div>
          <input
            value={queryParams.mentionAccount}
            onChange={(event) =>
              setQueryParams({ mentionAccount: CleanAccount(event.target.value) })
            }
            placeholder="Apple"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
        <div>
          <div style={sectionTitleStyle}>语言</div>
          <select
            aria-label="Language"
            value={queryParams.language}
            onChange={(event) => setQueryParams({ language: event.target.value as Language })}
            style={inputStyle}
          >
            <option value="all">全部语言</option>
            <option value="zh">中文 (zh)</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ru">Русский</option>
            <option value="th">ไทย</option>
            <option value="ar">العربية</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <div>
          <div style={sectionTitleStyle}>相对时间</div>
          <select
            aria-label="Time Range"
            value={queryParams.timeRange}
            onChange={(event) => setQueryParams({ timeRange: event.target.value as TimeRange })}
            style={inputStyle}
          >
            <option value="all">不限</option>
            <option value="1h">1 小时</option>
            <option value="4h">4 小时</option>
            <option value="12h">12 小时</option>
            <option value="24h">24 小时</option>
            <option value="2d">2 天</option>
            <option value="7d">7 天</option>
            <option value="30d">30 天</option>
          </select>
        </div>
        <div>
          <div style={sectionTitleStyle}>问句优先</div>
          <label
            style={{
              ...inputStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={queryParams.questionOnly}
              onChange={(event) => setQueryParams({ questionOnly: event.target.checked })}
              style={{ accentColor: '#1d9bf0' }}
            />
            仅看带 ? 的提问帖
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
        <div>
          <div style={sectionTitleStyle}>since (开始日期)</div>
          <input
            type="date"
            value={queryParams.sinceDate}
            onChange={(event) => setQueryParams({ sinceDate: event.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>until (结束日期)</div>
          <input
            type="date"
            value={queryParams.untilDate}
            onChange={(event) => setQueryParams({ untilDate: event.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
        <div>
          <div style={sectionTitleStyle}>near (地点)</div>
          <input
            value={queryParams.nearLocation}
            onChange={(event) => setQueryParams({ nearLocation: event.target.value })}
            placeholder='Tokyo / "New York"'
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>within (范围)</div>
          <input
            value={queryParams.withinDistance}
            onChange={(event) => setQueryParams({ withinDistance: event.target.value })}
            placeholder="10km / 5mi"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
        <div>
          <div style={sectionTitleStyle}>Min Likes</div>
          <input
            aria-label="Min Likes"
            type="number"
            min={0}
            value={queryParams.minFaves}
            onChange={(event) => setQueryParams({ minFaves: Number(event.target.value) || 0 })}
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>Min Retweets</div>
          <input
            type="number"
            min={0}
            value={queryParams.minRetweets}
            onChange={(event) =>
              setQueryParams({ minRetweets: Number(event.target.value) || 0 })
            }
            style={inputStyle}
          />
        </div>
        <div>
          <div style={sectionTitleStyle}>Min Replies</div>
          <input
            type="number"
            min={0}
            value={queryParams.minReplies}
            onChange={(event) =>
              setQueryParams({ minReplies: Number(event.target.value) || 0 })
            }
            style={inputStyle}
          />
        </div>
      </div>

      <button
        onClick={() => setShowAdvanced((prev) => !prev)}
        style={{
          background: 'none',
          border: 'none',
          color: '#1d9bf0',
          fontSize: '13px',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
        }}
      >
        {showAdvanced ? '收起高级操作符' : '展开高级操作符'}
      </button>

      {showAdvanced && (
        <div
          style={{
            border: '1px solid #2f3336',
            borderRadius: '10px',
            padding: '12px',
            background: '#111418',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <div style={sectionTitleStyle}>内容类型</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px' }}>
              {[
                ['images', '图片 filter:images'],
                ['videos', '视频 filter:videos'],
                ['links', '链接 filter:links'],
              ].map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={queryParams.mediaType.includes(value as MediaType)}
                    onChange={() => toggleMedia(value as MediaType)}
                    style={{ accentColor: '#1d9bf0' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div style={sectionTitleStyle}>包含条件</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px' }}>
              {[
                ['replies', '仅回复 is:reply'],
                ['verified', '认证账号 is:verified'],
                ['spaces', 'Spaces filter:spaces'],
              ].map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={queryParams.include.includes(value as IncludeType)}
                    onChange={() => toggleInclude(value as IncludeType)}
                    style={{ accentColor: '#1d9bf0' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div style={sectionTitleStyle}>排除条件</div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px' }}>
              {[
                ['retweets', '排除转推 -is:retweet'],
                ['replies', '排除回复 -is:reply'],
                ['links', '排除链接 -filter:links'],
              ].map(([value, label]) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="checkbox"
                    checked={queryParams.exclude.includes(value as ExcludeType)}
                    onChange={() => toggleExclude(value as ExcludeType)}
                    style={{ accentColor: '#1d9bf0' }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {renderTokenInput(
            'customOperators',
            '自定义操作符',
            '例如: url:github 或 filter:follows',
            '可添加任何高级语法，直接拼接到最终查询',
            'rgba(150, 118, 255, 0.25)'
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={resetQueryParams}
          style={{
            border: '1px solid #2f3336',
            background: 'transparent',
            color: '#a7b0b8',
            borderRadius: '8px',
            fontSize: '12px',
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          清空全部条件
        </button>
      </div>
    </div>
  )
}
