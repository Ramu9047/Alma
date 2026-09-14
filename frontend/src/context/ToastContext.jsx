import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ToastNotificationContainer from '../components/common/ToastNotificationContainer';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 5000, recipient }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast = {
      id,
      title: title || (type === 'dispatch' ? 'Alert Dispatched' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : type === 'error' ? 'Error' : 'Notification'),
      message,
      type,
      duration,
      recipient,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts on screen

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    show: showToast,
    dispatch: (message, recipient, title = 'Alert Dispatched Successfully') =>
      showToast({ title, message, type: 'dispatch', recipient, duration: 6000 }),
    success: (message, title = 'Operation Completed') =>
      showToast({ title, message, type: 'success', duration: 4500 }),
    warning: (message, title = 'Action Required') =>
      showToast({ title, message, type: 'warning', duration: 5500 }),
    error: (message, title = 'Action Blocked') =>
      showToast({ title, message, type: 'error', duration: 6000 }),
    info: (message, title = 'System Notification') =>
      showToast({ title, message, type: 'info', duration: 4500 })
  };

  // Intercept window.alert and window.confirm to prevent raw browser native popups
  useEffect(() => {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;

    window.alert = (msg) => {
      showToast({
        title: 'Academic Alert System',
        message: String(msg),
        type: 'dispatch',
        duration: 5500
      });
    };

    window.confirm = (msg) => {
      // Return true to prevent blocking thread with native browser modal
      return true;
    };

    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, toast, removeToast, toasts }}>
      {children}
      <ToastNotificationContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
