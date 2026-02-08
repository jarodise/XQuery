import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QueryBuilder from './QueryBuilder'
import { useStore } from '@/stores/useStore'
import type { QueryParams } from '@/types'

vi.mock('@/stores/useStore', () => ({
  useStore: vi.fn(),
}))

function createQueryParams(): QueryParams {
  return {
    keywords: [],
    keywordMode: 'and',
    anyKeywords: [],
    excludeKeywords: [],
    exactPhrase: '',
    fromAccount: '',
    toAccount: '',
    mentionAccount: '',
    sinceDate: '',
    untilDate: '',
    nearLocation: '',
    withinDistance: '',
    language: 'all',
    timeRange: 'all',
    minFaves: 0,
    minRetweets: 0,
    minReplies: 0,
    mediaType: [],
    include: [],
    exclude: [],
    questionOnly: false,
    customOperators: [],
  }
}

describe('QueryBuilder', () => {
  const mockSetQueryParams = vi.fn()
  const mockResetQueryParams = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useStore as any).mockReturnValue({
      queryParams: createQueryParams(),
      setQueryParams: mockSetQueryParams,
      resetQueryParams: mockResetQueryParams,
    })
  })

  it('renders key input groups', () => {
    render(<QueryBuilder />)

    expect(screen.getByPlaceholderText(/例如: AI, growth, iPhone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Time Range/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Min Likes/i)).toBeInTheDocument()
  })

  it('adds required keyword when pressing Enter', () => {
    render(<QueryBuilder />)

    const input = screen.getByPlaceholderText(/例如: AI, growth, iPhone/i)
    fireEvent.change(input, { target: { value: 'AI' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      keywords: ['AI'],
    })
  })

  it('changes language selection', () => {
    render(<QueryBuilder />)

    fireEvent.change(screen.getByLabelText(/Language/i), {
      target: { value: 'zh' },
    })

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      language: 'zh',
    })
  })

  it('shows advanced section after toggle', () => {
    render(<QueryBuilder />)

    fireEvent.click(screen.getByText(/展开高级操作符/i))

    expect(screen.getByText(/内容类型/i)).toBeInTheDocument()
    expect(screen.getByText(/包含条件/i)).toBeInTheDocument()
    expect(screen.getByText(/排除条件/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/url:github/i)).toBeInTheDocument()
  })
})
