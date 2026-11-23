<script setup lang="ts">
import { useSessionStore } from '@/stores/session'
import { useGreedStore } from '@/stores/greed'

const sessionStore = useSessionStore()
const greedStore = useGreedStore()

async function onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value) {
    await greedStore.connectSessionById(select.value)
  }
}

async function handleQuickNewSession() {
  const charId = greedStore.state?.character.id ?? 'isaac'
  await greedStore.createNewSession(charId)
}
</script>

<template>
  <section class="card bg-base-100 border border-base-300">
    <div class="card-body p-5 space-y-4">
      <div class="flex items-center justify-between gap-2">
        <h2 class="card-title text-lg">Збережені сесії</h2>
        <button
          type="button"
          class="btn btn-outline btn-xs"
          :disabled="greedStore.isLoading"
          @click="handleQuickNewSession"
        >
          + Нова сесія
        </button>
      </div>

      <label v-if="sessionStore.sessions.length > 0" class="form-control w-full">
        <span class="label-text text-xs mb-1 block">Швидке перемикання</span>
        <select
          class="select select-bordered select-sm w-full"
          :value="sessionStore.activeSessionId"
          @change="onSelectChange"
        >
          <option value="" disabled>Оберіть сесію</option>
          <option
            v-for="session in sessionStore.sessions"
            :key="session.id"
            :value="session.id"
          >
            {{ session.name }} ({{ session.characterName }})
          </option>
        </select>
      </label>

      <ul
        v-if="sessionStore.sessions.length > 0"
        class="divide-y divide-base-200 max-h-96 overflow-y-auto"
      >
        <li
          v-for="session in sessionStore.sessions"
          :key="session.id"
          class="py-2.5 flex items-center justify-between gap-2"
        >
          <button
            type="button"
            class="text-left flex-1 rounded px-2 py-1 hover:bg-base-200 transition-colors"
            :class="session.id === sessionStore.activeSessionId ? 'bg-base-200 font-semibold' : ''"
            @click="greedStore.connectSessionById(session.id)"
          >
            <div class="text-sm flex items-center gap-2">
              <span>{{ session.name }}</span>
              <span
                v-if="session.id === sessionStore.activeSessionId"
                class="badge badge-primary badge-xs"
              >
                активна
              </span>
            </div>
            <div class="text-xs text-base-content/60 font-mono">
              {{ session.id }} | {{ session.characterName }}
            </div>
          </button>

          <button
            type="button"
            class="btn btn-ghost btn-xs text-error"
            @click="greedStore.removeSavedSession(session.id)"
          >
            ✕
          </button>
        </li>
      </ul>

      <p v-else class="text-sm text-base-content/60">
        Список сесій порожній. Створіть новий забіг або підключіть існуючий ID.
      </p>
    </div>
  </section>
</template>
