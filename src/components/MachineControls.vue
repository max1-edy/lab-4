<script setup lang="ts">
import { ref } from 'vue'
import { useGreedStore } from '@/stores/greed'
import { useAvatarUrl } from '@/composables/useAvatarUrl'

const greedStore = useGreedStore()
const { resolveAvatar } = useAvatarUrl()

const resetMachineCounter = ref(false)
</script>

<template>
  <section class="card bg-base-100 border border-base-300 w-full">
    <div v-if="greedStore.state" class="card-body p-5 space-y-4">
      <div class="flex items-center justify-between gap-2 pb-2 border-b border-base-200">
        <div class="flex items-center gap-2">
          <img
            :src="resolveAvatar(greedStore.state.character.avatar_url)"
            :alt="greedStore.state.character.name"
            class="w-8 h-8 object-contain"
            style="image-rendering: pixelated;"
          />
          <div class="text-sm">
            <p class="font-bold leading-tight">{{ greedStore.state.character.name }}</p>
            <p class="text-xs text-base-content/60 font-mono">{{ greedStore.state.session_id }}</p>
          </div>
        </div>

        <span
          class="badge badge-sm"
          :class="greedStore.state.is_jammed ? 'badge-error' : 'badge-success'"
        >
          {{ greedStore.state.is_jammed ? 'Заклинило' : 'Активний' }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-center">
        <div class="p-2 rounded-box bg-base-200">
          <span class="text-xs text-base-content/60 block">Гаманець</span>
          <span class="text-lg font-bold">{{ greedStore.state.wallet }}</span>
        </div>
        <div class="p-2 rounded-box bg-base-200">
          <span class="text-xs text-base-content/60 block">Бомби</span>
          <span class="text-lg font-bold">{{ greedStore.state.bombs }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between text-sm px-1">
        <span>Jam Chance:</span>
        <span
          class="font-bold"
          :class="greedStore.state.jam_chance >= 20 ? 'text-error' : 'text-base-content'"
        >
          {{ greedStore.state.jam_chance.toFixed(2) }}%
        </span>
      </div>

      <div v-if="greedStore.state.is_jammed" class="alert alert-warning text-xs py-2">
        <span>Автомат заклинило! Використайте бомбу або скиньте спробу.</span>
      </div>

      <div class="flex flex-col gap-2">
        <button
          type="button"
          class="btn btn-primary w-full"
          :disabled="!greedStore.canDonate"
          @click="greedStore.donate()"
        >
          Кинути 1 монету (Донат)
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="btn btn-warning btn-sm"
            :disabled="!greedStore.canBomb"
            @click="greedStore.useBomb()"
          >
            Підірвати бомбою
          </button>

          <button
            type="button"
            class="btn btn-outline btn-sm"
            :disabled="greedStore.isActionBusy"
            @click="greedStore.resetAttempt(resetMachineCounter)"
          >
            Скинути спробу
          </button>
        </div>

        <label class="label cursor-pointer justify-start gap-2 pt-1">
          <input
            v-model="resetMachineCounter"
            type="checkbox"
            class="checkbox checkbox-xs"
          />
          <span class="label-text text-xs">Також обнулити лічильник автомата при скиданні</span>
        </label>
      </div>
    </div>

    <div v-else class="card-body p-5 text-center space-y-2">
      <p class="font-semibold">Немає активної сесії</p>
      <p class="text-sm text-base-content/70">
        Оберіть персонажа і натисніть «Новий забіг», або виберіть збережену сесію праворуч.
      </p>
    </div>
  </section>
</template>
