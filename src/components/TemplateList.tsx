import { useStore } from '@/stores/useStore'
import { templates, regionLabels } from '@/data/templates'
import type { Region } from '@/types'
import TemplateCard from './TemplateCard'
import { executeSearch } from '@/utils/xSearch'

const regions: Region[] = ['zh', 'ja', 'es', 'en', 'global']

export default function TemplateList() {
  const { selectedRegion, setSelectedRegion } = useStore()

  const handleTemplateClick = (query: string) => {
    executeSearch(query)
  }

  return (
    <div>
      {/* Region selector */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedRegion === region ? '#1d9bf0' : '#2f3336',
              background: selectedRegion === region ? 'rgba(29, 155, 240, 0.1)' : 'transparent',
              color: selectedRegion === region ? '#1d9bf0' : '#71767b',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {regionLabels[region]}
          </button>
        ))}
      </div>

      {/* Template list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {templates[selectedRegion].map((template, index) => (
          <div
            key={template.id}
            style={{
              animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            <TemplateCard
              template={template}
              onClick={() => handleTemplateClick(template.query)}
            />
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
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
