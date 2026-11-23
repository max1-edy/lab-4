# The Greed Machine (Лабораторна робота №4)

Клієнтський веб-застосунок для REST API гри The Greed Machine на Vue 3, TypeScript, Pinia, Axios, Tailwind CSS та DaisyUI.

## Архітектура (3 рівні)

1. **HTTP-клієнт та інтерцептори (`src/api/httpClient.ts`)**: інстанс Axios із базовим URL API, Request Interceptor для автоматичного додавання заголовка `X-Session-ID` з активного Pinia-стора та Response Interceptor для централізованої обробки відповідей і помилок (`400`, `404`, `409`, `422`, `429`, `500`) із викликом Toast-сповіщень.
2. **Сервісний шар (`src/services/greedService.ts`)**: типізовані методи для ендпоінтів Greed Machine (`/characters`, `/session/new`, `/session/{id}/verify`, `/state`, `/select-character`, `/donate`, `/bomb`, `/reset`).
3. **Стан, композабли та UI (`src/stores/`, `src/composables/`, `src/components/`)**: Pinia-стори для сесій, автомата і тостів, композабли `useLocalStorage`, `useGreedDigits`, `usePayloadRunner`, `useAvatarUrl` та компоненти з `GreedMachine.vue` і DaisyUI `countdown` / `toast`.

## Запуск

```bash
npm install
npm run dev
```

## Перевірка типів і збірка

```bash
npm run type-check
npm run build
```
