import { useState, useRef, useEffect } from 'react'
import Modal from './Modal'

interface InputDialogProps {
  isOpen: boolean
  onClose: (value: string | null) => void
  title: string
  defaultValue?: string
  placeholder?: string
  maxLength?: number
}

export default function InputDialog({
  isOpen,
  onClose,
  title,
  defaultValue = '',
  placeholder = '',
  maxLength = 100,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  const handleSubmit = () => {
    onClose(value.trim() || null)
  }

  const handleCancel = () => {
    onClose(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            background: '#16181c',
            border: '1px solid #2f3336',
            borderRadius: '8px',
            color: '#e7e9ea',
            padding: '12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#1d9bf0'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#2f3336'
          }}
        />
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#1d9bf0',
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
              e.currentTarget.style.background = '#1a8cd8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1d9bf0'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
