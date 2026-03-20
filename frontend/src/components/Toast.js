import React, { useState, useContext, createContext } from "react"
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi"
import "./Toast.css"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now()
    const toast = { id, message, type }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ id, message, type, onClose }) {
  const icons = {
    success: <FiCheckCircle className="toast-icon" />,
    error: <FiAlertCircle className="toast-icon" />,
    info: <FiInfo className="toast-icon" />,
  }

  return (
    <div className={`toast toast-${type} slide-in`}>
      {icons[type]}
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>
        <FiX />
      </button>
    </div>
  )
}

export default Toast
