import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ToastItem, ToastType } from '@/types/greed'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((item) => item.id !== id)
  }

  function showToast(message: string, type: ToastType = 'info', duration = 4000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    toasts.value = [...toasts.value, { id, message, type }].slice(-5)

    if (duration > 0) {
      window.setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
})
