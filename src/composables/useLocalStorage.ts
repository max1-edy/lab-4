import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  const readValue = (): T => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initialValue
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  }

  const stored = ref<T>(readValue()) as Ref<T>

  watch(
    stored,
    (next) => {
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        return
      }
    },
    { deep: true },
  )

  return stored
}
