import { ref, readonly } from 'vue'

// Toast state
const toasts = ref([])
let toastId = 0

// Default options
const defaultOptions = {
  title: '',
  message: '',
  variant: 'default',
  duration: 5000,
  closable: true,
  showProgress: true,
  icon: null,
  action: null
}

/**
 * useToast composable
 * Provides methods to show and manage toast notifications
 */
export function useToast() {
  /**
   * Show a toast notification
   * @param {Object|string} options - Toast options or message string
   * @returns {number} Toast ID
   */
  const show = (options) => {
    const id = ++toastId

    // Handle string shorthand
    if (typeof options === 'string') {
      options = { message: options }
    }

    const toast = {
      ...defaultOptions,
      ...options,
      id,
      createdAt: Date.now()
    }

    toasts.value.push(toast)

    return id
  }

  /**
   * Show success toast
   * @param {string} message
   * @param {Object} options
   * @returns {number} Toast ID
   */
  const success = (message, options = {}) => {
    return show({
      ...options,
      message,
      variant: 'success',
      title: options.title || 'SYSTEM ONLINE'
    })
  }

  /**
   * Show warning toast
   * @param {string} message
   * @param {Object} options
   * @returns {number} Toast ID
   */
  const warning = (message, options = {}) => {
    return show({
      ...options,
      message,
      variant: 'warning',
      title: options.title || 'CAUTION'
    })
  }

  /**
   * Show danger/error toast
   * @param {string} message
   * @param {Object} options
   * @returns {number} Toast ID
   */
  const danger = (message, options = {}) => {
    return show({
      ...options,
      message,
      variant: 'danger',
      title: options.title || 'CRITICAL ALERT'
    })
  }

  /**
   * Show info toast
   * @param {string} message
   * @param {Object} options
   * @returns {number} Toast ID
   */
  const info = (message, options = {}) => {
    return show({
      ...options,
      message,
      variant: 'info',
      title: options.title || 'NOTICE'
    })
  }

  /**
   * Show creep/anomaly toast
   * @param {string} message
   * @param {Object} options
   * @returns {number} Toast ID
   */
  const creep = (message, options = {}) => {
    return show({
      ...options,
      message,
      variant: 'creep',
      title: options.title || 'ANOMALY DETECTED'
    })
  }

  /**
   * Dismiss a specific toast by ID
   * @param {number} id
   */
  const dismiss = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Dismiss all toasts
   */
  const dismissAll = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    show,
    success,
    warning,
    danger,
    info,
    creep,
    dismiss,
    dismissAll
  }
}

// Export toasts ref for GToastContainer
export { toasts }
