import { useEffect, useState } from 'react'

const listeners = new Set()
let toastId = 0

function emitToast(toast) {
  listeners.forEach((listener) => listener(toast))
}

function createToast(type, message) {
  toastId += 1
  emitToast({ id: toastId, type, message })
}

export const toast = {
  success: (message) => createToast('success', message),
  error: (message) => createToast('error', message),
  info: (message) => createToast('info', message),
}

export function ToastContainer({ autoClose = 3200 }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handler = (toastData) => {
      setToasts((prev) => [...prev, toastData])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toastItem) => toastItem.id !== toastData.id))
      }, autoClose)
    }

    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [autoClose])

  return (
    <div className="toastify-container" aria-live="polite">
      {toasts.map((toastItem) => (
        <div key={toastItem.id} className={`toastify-toast toastify-toast--${toastItem.type}`}>
          {toastItem.message}
        </div>
      ))}
    </div>
  )
}
