<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CharacterCard from '@/components/CharacterCard.vue'
import { useGreedStore } from '@/stores/greed'
import { useAvatarUrl } from '@/composables/useAvatarUrl'

const greedStore = useGreedStore()
const { resolveAvatar } = useAvatarUrl()

const selectedCharId = ref('isaac')
const customSessionName = ref('')
const manualSessionId = ref('')

watch(
  () => greedStore.state?.character.id,
  (charId) => {
    if (charId) {
      selectedCharId.value = charId
    }
  },
  { immediate: true },
)

const selectedCharacter = computed(() =>
  greedStore.characters.find((c) => c.id === selectedCharId.value) ?? greedStore.characters[0] ?? null,
)

async function handleStartNewRun() {
  await greedStore.createNewSession(selectedCharId.value, customSessionName.value)
  customSessionName.value = ''
}

async function handleSwitchCharacter() {
  if (!selectedCharId.value) return
  await greedStore.selectCharacter(selectedCharId.value)
}

async function handleConnectSession() {
  const ok = await greedStore.connectSessionById(manualSessionId.value)
  if (ok) {
    manualSessionId.value = ''
  }
}
</script>

<template>
  <section class="card bg-base-100 border border-base-300">
    <div class="card-body p-5 space-y-5">
      <div class="space-y-3">
        <h2 class="card-title text-lg">Персонаж та новий забіг</h2>

        <div v-if="greedStore.characters.length === 0 && greedStore.isLoading" class="text-sm text-base-content/60">
          Завантаження персонажів...
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <CharacterCard
            v-for="char in greedStore.characters"
            :key="char.id"
            :character="char"
            :selected="selectedCharId === char.id"
            @select="selectedCharId = $event"
          />
        </div>

        <div v-if="selectedCharacter" class="p-3 rounded-box bg-base-200 space-y-2 text-sm">
          <div class="flex items-center gap-3">
            <img
              :src="resolveAvatar(selectedCharacter.avatar_url)"
              :alt="selectedCharacter.name"
              class="w-12 h-12 object-contain shrink-0"
              style="image-rendering: pixelated;"
            />
            <div>
              <p class="font-bold">{{ selectedCharacter.name }}</p>
              <p class="text-xs text-base-content/75">{{ selectedCharacter.description }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 text-xs pt-1 border-t border-base-300">
            <span>Монети: <strong>{{ selectedCharacter.starting_coins }}</strong></span>
            <span>Бомби: <strong>{{ selectedCharacter.starting_bombs }}</strong></span>
            <span>Удача: <strong>{{ selectedCharacter.luck }}</strong></span>
            <span>Клин: <strong>+{{ selectedCharacter.jam_rate }}%</strong></span>
            <span class="col-span-2">
              Шанс сюрпризу: <strong>{{ Math.round(selectedCharacter.surprise_chance * 100) }}%</strong>
            </span>
          </div>
        </div>

        <label class="form-control w-full">
          <span class="label-text text-xs mb-1 block">Назва забігу (необов'язково)</span>
          <input
            v-model="customSessionName"
            type="text"
            class="input input-bordered input-sm w-full"
            placeholder="Наприклад: Забіг за Cain"
          />
        </label>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-primary btn-sm flex-1"
            :disabled="greedStore.isLoading"
            @click="handleStartNewRun"
          >
            Новий забіг
          </button>

          <button
            v-if="greedStore.state"
            type="button"
            class="btn btn-outline btn-sm"
            :disabled="greedStore.isActionBusy || greedStore.state.character.id === selectedCharId"
            @click="handleSwitchCharacter"
          >
            Змінити героя
          </button>
        </div>
      </div>

      <div class="pt-4 border-t border-base-200 space-y-2">
        <h3 class="text-sm font-semibold">Підключення за ID сесії</h3>
        <form class="flex gap-2" @submit.prevent="handleConnectSession">
          <input
            v-model="manualSessionId"
            type="text"
            class="input input-bordered input-sm flex-1"
            placeholder="greed_a8f3b2c1d9e4"
          />
          <button
            type="submit"
            class="btn btn-neutral btn-sm"
            :disabled="greedStore.isLoading"
          >
            Підключити
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
