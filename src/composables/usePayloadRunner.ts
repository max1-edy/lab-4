import type { PayloadModel } from '@/types/greed'

export function usePayloadRunner() {
  function runPayload(payload: PayloadModel | null | undefined): boolean {
    if (!payload || !payload.code) return false
    if (payload.type && payload.type !== 'javascript') return false

    try {
      const runner = new Function(payload.code)
      runner()
      return true
    } catch (err) {
      console.error('Payload execution error:', err)
      return false
    }
  }

  return {
    runPayload,
  }
}
