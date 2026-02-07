import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FavoritesList from './FavoritesList'
import { useStore } from '@/stores/useStore'
import { executeSearch } from '@/utils/xSearch'

// Mock dependencies
vi.mock('@/stores/useStore', () => ({
    useStore: vi.fn(),
}))
vi.mock('@/utils/xSearch', () => ({
    executeSearch: vi.fn(),
}))

describe('FavoritesList', () => {
    const mockRemoveFavorite = vi.fn()
    const mockUpdateFavorite = vi.fn()
    const mockFavorites = [
        {
            id: '1',
            name: 'AI Search',
            query: 'AI OR ChatGPT',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            id: '2',
            name: 'Crypto News',
            query: '#Crypto min_faves:100',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
            ; (useStore as any).mockReturnValue({
                favorites: mockFavorites,
                removeFavorite: mockRemoveFavorite,
                updateFavorite: mockUpdateFavorite,
            })
    })

    it('renders all favorites', () => {
        render(<FavoritesList />)
        expect(screen.getByText('AI Search')).toBeInTheDocument()
        expect(screen.getByText('AI OR ChatGPT')).toBeInTheDocument()
        expect(screen.getByText('Crypto News')).toBeInTheDocument()
        expect(screen.getByText('#Crypto min_faves:100')).toBeInTheDocument()
    })

    it('calls executeSearch when a favorite is clicked', () => {
        render(<FavoritesList />)
        const favoriteItem = screen.getByText('AI Search')
        fireEvent.click(favoriteItem)
        expect(executeSearch).toHaveBeenCalledWith('AI OR ChatGPT')
    })

    it('calls removeFavorite when delete button is clicked', () => {
        // I need to make sure I have a delete button in the implementation
        render(<FavoritesList />)
        const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
        fireEvent.click(deleteButtons[0])
        expect(mockRemoveFavorite).toHaveBeenCalledWith('1')
    })

    it('shows empty state when no favorites exist', () => {
        ; (useStore as any).mockReturnValue({
            favorites: [],
            removeFavorite: mockRemoveFavorite,
            updateFavorite: mockUpdateFavorite,
        })
        render(<FavoritesList />)
        expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument()
    })
})
