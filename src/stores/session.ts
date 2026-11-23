import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { SavedSession } from '@/types/greed'

const SESSIONS_STORAGE_KEY = 'greed_machine_sessions'
const ACTIVE_SESSION_KEY = 'greed_machine_active_session'

export const useSessionStore = defineStore('session', () => {
  const sessions = useLocalStorage<SavedSession[]>(SESSIONS_STORAGE_KEY, [])
  const activeSessionId = useLocalStorage<string>(ACTIVE_SESSION_KEY, '')

  const hasActiveSession = computed(() => activeSessionId.value.trim().length > 0)

  const currentSavedSession = computed(() =>
    sessions.value.find((item) => item.id === activeSessionId.value) ?? null,
  )

  function setActiveSession(id: string) {
    activeSessionId.value = id.trim()
  }

  function saveSession(entry: SavedSession) {
    const existingIndex = sessions.value.findIndex((item) => item.id === entry.id)
    if (existingIndex === -1) {
      sessions.value = [entry, ...sessions.value]
    } else {
      const updated = [...sessions.value]
      updated[existingIndex] = entry
      sessions.value = updated
    }
  }

  function removeSession(id: string) {
    sessions.value = sessions.value.filter((item) => item.id !== id)
    if (activeSessionId.value === id) {
      activeSessionId.value = sessions.value[0]?.id ?? ''
    }
  }

  return {
    sessions,
    activeSessionId,
    hasActiveSession,
    currentSavedSession,
    setActiveSession,
    saveSession,
    removeSession,
  }
})
