import { API_ORIGIN } from '@/api/httpClient'

export function useAvatarUrl() {
  function resolveAvatar(path: string): string {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
  }

  return {
    resolveAvatar,
  }
}
