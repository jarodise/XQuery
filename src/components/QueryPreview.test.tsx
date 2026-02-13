import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import QueryPreview from './QueryPreview'
import { useStore } from '@/stores/useStore'
import { buildQueryString } from '@/utils/queryBuilder'
import { executeSearch } from '@/utils/xSearch'

// Mock dependencies
vi.mock('@/stores/useStore', () => ({
    useStore: vi.fn(),
}))
vi.mock('@/utils/queryBuilder', () => ({
    buildQueryString: vi.fn(),
}))
vi.mock('@/utils/xSearch', () => ({
    executeSearch: vi.fn(),
}))

describe('QueryPreview', () => {
    const mockAddFavorite = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
            ; (useStore as any).mockReturnValue({
                queryParams: {
                    keywords: ['AI'],
                    language: 'en',
                    timeRange: 'all',
                    minFaves: 0,
                    mediaType: [],
                    exclude: [],
                },
                addFavorite: mockAddFavorite,
            })
            ; (buildQueryString as any).mockReturnValue('AI lang:en')
    })

    it('renders the generated query', () => {
        render(<QueryPreview />)
        expect(screen.getByDisplayValue('AI lang:en')).toBeInTheDocument()
    })

    it('calls executeSearch when Search button is clicked', () => {
        render(<QueryPreview />)
        const searchButton = screen.getByRole('button', { name: /Search/i })
        fireEvent.click(searchButton)
        expect(executeSearch).toHaveBeenCalledWith('AI lang:en')
    })

    it('opens favorite naming dialog when Save button is clicked', () => {
        // We'll use window.prompt for simplicity or a custom UI. 
        // The requirement says "Save to favorites" button.
        render(<QueryPreview />)
        const saveButton = screen.getByRole('button', { name: /Save/i })

        vi.spyOn(window, 'prompt').mockReturnValue('My Favorite AI')
        fireEvent.click(saveButton)

        expect(mockAddFavorite).toHaveBeenCalledWith('My Favorite AI', 'AI lang:en')
    })

    it('uses edited query when user modifies preview', () => {
        render(<QueryPreview />)
        const textarea = screen.getByLabelText(/Editable query preview/i)

        fireEvent.change(textarea, { target: { value: 'custom edited query' } })
        fireEvent.click(screen.getByRole('button', { name: /Search/i }))

        expect(executeSearch).toHaveBeenCalledWith('custom edited query')
    })
})
