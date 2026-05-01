import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg, type = '') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div style={{ position:'fixed', bottom:28, right:28, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
