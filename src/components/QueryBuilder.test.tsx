import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QueryBuilder from './QueryBuilder'
import { useStore } from '@/stores/useStore'

// Mock the store
vi.mock('@/stores/useStore', () => ({
    useStore: vi.fn(),
}))

describe('QueryBuilder', () => {
    const mockSetQueryParams = vi.fn()
    const mockResetQueryParams = vi.fn()
    const mockAddFavorite = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
            ; (useStore as any).mockReturnValue({
                queryParams: {
                    keywords: [],
                    language: 'all',
                    timeRange: 'all',
                    minFaves: 0,
                    mediaType: [],
                    exclude: [],
                },
                setQueryParams: mockSetQueryParams,
                resetQueryParams: mockResetQueryParams,
                addFavorite: mockAddFavorite,
            })
    })

    it('renders all basic input fields', () => {
        render(<QueryBuilder />)

        expect(screen.getByPlaceholderText(/Add keywords/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Language/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Time Range/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Min Likes/i)).toBeInTheDocument()
    })

    it('updates keywords when typing and pressing enter', () => {
        render(<QueryBuilder />)

        const input = screen.getByPlaceholderText(/Add keywords/i)
        fireEvent.change(input, { target: { value: 'AI' } })
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

        expect(mockSetQueryParams).toHaveBeenCalledWith({
            keywords: ['AI'],
        })
    })

    it('updates language when selection changes', () => {
        render(<QueryBuilder />)

        const select = screen.getByLabelText(/Language/i)
        fireEvent.change(select, { target: { value: 'zh-cn' } })

        expect(mockSetQueryParams).toHaveBeenCalledWith({
            language: 'zh-cn',
        })
    })

    it('toggles advanced filters', () => {
        render(<QueryBuilder />)

        const advancedButton = screen.getByText(/Advanced Filters/i)
        fireEvent.click(advancedButton)

        // Check for advanced options
        expect(screen.getByLabelText(/Images/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Videos/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Retweets/i)).toBeInTheDocument()
    })
})
