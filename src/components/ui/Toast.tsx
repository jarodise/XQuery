import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 150) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: '#00ba7c',
    error: '#f4212e',
    info: '#1d9bf0',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  const toastContent = (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: `translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(20px)'}`,
        background: '#16181c',
        border: `1px solid ${colors[type]}`,
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 999999,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.15s ease-out',
        pointerEvents: 'auto',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: colors[type],
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {icons[type]}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#e7e9ea',
          fontWeight: 500,
        }}
      >
        {message}
      </span>
    </div>
  )

  // Try to use portal for better DOM isolation
  const modalRoot = document.getElementById('x-query-search-root')
  if (modalRoot) {
    return createPortal(toastContent, modalRoot)
  }

  return toastContent
}

// Hook for managing toasts
let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )

  return {
    showToast,
    ToastContainer,
  }
}
