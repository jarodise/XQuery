import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(91, 112, 131, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        animation: 'fadeIn 0.15s ease-out',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#000000',
          border: '1px solid #2f3336',
          borderRadius: '16px',
          padding: '20px',
          minWidth: '300px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {title && (
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#e7e9ea',
              margin: '0 0 16px 0',
            }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )

  // Try to use portal for better DOM isolation
  const modalRoot = document.getElementById('x-query-search-root')
  if (modalRoot) {
    return createPortal(modalContent, modalRoot)
  }

  return modalContent
}

// Add keyframes for animations
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`
if (!document.head.querySelector('style[data-xquery-modal]')) {
  style.setAttribute('data-xquery-modal', 'true')
  document.head.appendChild(style)
}
