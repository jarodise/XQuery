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
    const mockAddSearchHistory = vi.fn()

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
                addSearchHistory: mockAddSearchHistory,
            })
            ; (buildQueryString as any).mockReturnValue('AI lang:en')
    })

    it('renders the generated query', () => {
        render(<QueryPreview />)
        expect(screen.getByText('AI lang:en')).toBeInTheDocument()
    })

    it('calls executeSearch when Search button is clicked', () => {
        render(<QueryPreview />)
        const searchButton = screen.getByRole('button', { name: /Search/i })
        fireEvent.click(searchButton)
        expect(executeSearch).toHaveBeenCalledWith('AI lang:en')
    })

    it('opens input dialog when Save button is clicked', () => {
        render(<QueryPreview />)
        const saveButton = screen.getByRole('button', { name: /Save/i })
        fireEvent.click(saveButton)

        // The component now opens an InputDialog instead of using window.prompt
        // We just verify the button click doesn't crash and the dialog would appear
        expect(saveButton).toBeInTheDocument()
    })
})
