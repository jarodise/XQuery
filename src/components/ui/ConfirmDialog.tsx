import { ReactNode } from 'react'
import Modal from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: (confirmed: boolean) => void
  title: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onClose(true)
  }

  const handleCancel = () => {
    onClose(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            fontSize: '14px',
            color: '#e7e9ea',
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              background: 'transparent',
              border: '1px solid #2f3336',
              color: '#e7e9ea',
              padding: '10px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(231, 233, 234, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              background: isDestructive ? '#f4212e' : '#1d9bf0',
              border: 'none',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDestructive ? '#d91c28' : '#1a8cd8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDestructive ? '#f4212e' : '#1d9bf0'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
