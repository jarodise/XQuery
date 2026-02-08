import { useMemo, useState } from 'react'
import { useStore } from '@/stores/useStore'
import { categoryLabels, templates, regionLabels } from '@/data/templates'
import type { Region, TemplateCategory } from '@/types'
import TemplateCard from './TemplateCard'
import { executeSearch } from '@/utils/xSearch'

const regions: Region[] = ['zh', 'ja', 'es', 'en', 'global']

export default function TemplateList() {
  const { selectedRegion, setSelectedRegion } = useStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | TemplateCategory>('all')

  const regionTemplates = templates[selectedRegion]
  const categories = useMemo(() => {
    const unique = new Set<TemplateCategory>()
    regionTemplates.forEach((template) => {
      if (template.category) unique.add(template.category)
    })
    return Array.from(unique)
  }, [regionTemplates])

  const filteredTemplates = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return regionTemplates.filter((template) => {
      const categoryOk = selectedCategory === 'all' || template.category === selectedCategory
      if (!categoryOk) return false
      if (!keyword) return true
      const haystack = [
        template.name,
        template.description,
        template.query,
        ...(template.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(keyword)
    })
  }, [regionTemplates, search, selectedCategory])

  const handleTemplateClick = (query: string) => {
    executeSearch(query)
  }

  return (
    <div>
      <div
        style={{
          background: '#111418',
          border: '1px solid #2f3336',
          borderRadius: '10px',
          padding: '10px',
          marginBottom: '12px',
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="搜索模板（关键词/场景/操作符）"
          style={{
            width: '100%',
            background: '#000000',
            border: '1px solid #2f3336',
            borderRadius: '8px',
            color: '#e7e9ea',
            padding: '8px 10px',
            fontSize: '12px',
            marginBottom: '8px',
            outline: 'none',
          }}
        />
        <div style={{ fontSize: '11px', color: '#71767b' }}>
          共 {filteredTemplates.length} 个模板 · 直接点击卡片即可搜索
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => {
              setSelectedRegion(region)
              setSelectedCategory('all')
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedRegion === region ? '#1d9bf0' : '#2f3336',
              background: selectedRegion === region ? 'rgba(29, 155, 240, 0.12)' : 'transparent',
              color: selectedRegion === region ? '#8ecdf8' : '#71767b',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {regionLabels[region]}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid #2f3336',
            fontSize: '11px',
            color: selectedCategory === 'all' ? '#1d9bf0' : '#99a2ab',
            background: selectedCategory === 'all' ? 'rgba(29, 155, 240, 0.12)' : 'transparent',
            cursor: 'pointer',
          }}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              border: '1px solid #2f3336',
              fontSize: '11px',
              color: selectedCategory === category ? '#1d9bf0' : '#99a2ab',
              background:
                selectedCategory === category ? 'rgba(29, 155, 240, 0.12)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTemplates.map((template, index) => (
          <div
            key={template.id}
            style={{
              animation: `fadeSlideIn 0.24s ease-out ${index * 0.03}s both`,
            }}
          >
            <TemplateCard
              template={template}
              onClick={() => handleTemplateClick(template.query)}
            />
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div
          style={{
            marginTop: '16px',
            border: '1px dashed #2f3336',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            color: '#71767b',
            fontSize: '12px',
          }}
        >
          没有匹配模板，换个关键词或分类试试
        </div>
      )}

      <style>
        {`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}
