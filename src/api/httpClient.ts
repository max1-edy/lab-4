import axios, { type AxiosError } from 'axios'
import { useSessionStore } from '@/stores/session'
import { useToastStore } from '@/stores/toast'

export const API_ORIGIN = 'https://wurger-palantir.duckdns.org'
export const API_BASE_URL = `${API_ORIGIN}/demo-api`

interface ServerErrorBody {
  detail?: string | { message?: string } | Array<{ msg?: string }>
  message?: string
}

function extractErrorMessage(data: ServerErrorBody | undefined): string {
  if (!data) return ''
  if (typeof data.message === 'string' && data.message.trim()) return data.message
  if (typeof data.detail === 'string') {
    return data.detail.trim()
  }
  if (data.detail && !Array.isArray(data.detail) && typeof data.detail.message === 'string') {
    return data.detail.message
  }
  if (Array.isArray(data.detail) && data.detail.length > 0 && data.detail[0]?.msg) {
    return data.detail[0].msg
  }
  return ''
}

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const url = config.url ?? ''
  const skipSessionHeader = url.includes('/session/new') || url.includes('/verify')
  const sessionStore = useSessionStore()
  if (!skipSessionHeader && sessionStore.activeSessionId) {
    config.headers['X-Session-ID'] = sessionStore.activeSessionId
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => {
    const toastStore = useToastStore()
    const body = response.data as { message?: string; payload?: { name?: string } | null } | null

    if (body && typeof body.message === 'string' && body.message.trim()) {
      toastStore.showToast(body.message, 'success')
    }
    if (body?.payload?.name) {
      toastStore.showToast(`Сюрприз: ${body.payload.name}`, 'info', 5000)
    }

    return response
  },
  (error: AxiosError<ServerErrorBody>) => {
    const toastStore = useToastStore()
    const status = error.response?.status
    const serverMessage = extractErrorMessage(error.response?.data)

    if (status === 409) {
      toastStore.showToast(
        serverMessage || 'Автомат заклинило (409)! Використайте бомбу або скиньте спробу.',
        'warning',
      )
    } else if (status === 429) {
      toastStore.showToast(
        serverMessage || 'Занадто багато запитів (429). Трохи сповільніться.',
        'warning',
      )
    } else if (status === 404) {
      toastStore.showToast(
        serverMessage || 'Сесію не знайдено (404). Перевірте коректність ID.',
        'error',
      )
    } else if (status === 400) {
      toastStore.showToast(
        serverMessage || 'Неможливо виконати дію (400).',
        'error',
      )
    } else if (status === 422) {
      toastStore.showToast(
        serverMessage || 'Некоректні параметри запиту (422).',
        'error',
      )
    } else {
      toastStore.showToast(
        serverMessage || 'Помилка з\'єднання із сервером.',
        'error',
      )
    }

    return Promise.reject(error)
  },
)
