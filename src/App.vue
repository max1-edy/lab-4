<script setup lang="ts">
import { computed, onMounted } from 'vue'
import GreedMachine from '@/components/GreedMachine.vue'
import CharacterPanel from '@/components/CharacterPanel.vue'
import MachineControls from '@/components/MachineControls.vue'
import SessionsPanel from '@/components/SessionsPanel.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useGreedStore } from '@/stores/greed'
import { useGreedDigits } from '@/composables/useGreedDigits'

const greedStore = useGreedStore()
const coinsRef = computed(() => greedStore.coinsInMachine)
const { hundreds, tens, units } = useGreedDigits(coinsRef)

onMounted(async () => {
  await greedStore.loadCharacters()
  await greedStore.restoreActiveSession()
})
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-6 space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">The Greed Machine</h1>
        <p class="text-sm text-base-content/70">
          Клієнт грального автомата жадібності на Vue 3, Axios та DaisyUI
        </p>
      </div>
      <span v-if="greedStore.isLoading" class="loading loading-spinner loading-sm" />
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4">
        <CharacterPanel />
      </div>

      <div class="lg:col-span-4 flex flex-col items-center gap-5">
        <div :class="{ 'machine-shake': greedStore.isShaking }">
          <GreedMachine>
            <span class="countdown">
              <span :style="{ '--value': hundreds, '--digits': 1 }">{{ hundreds }}</span>
            </span>
            <span class="countdown">
              <span :style="{ '--value': tens, '--digits': 1 }">{{ tens }}</span>
            </span>
            <span class="countdown">
              <span :style="{ '--value': units, '--digits': 1 }">{{ units }}</span>
            </span>
          </GreedMachine>
        </div>

        <MachineControls />
      </div>

      <div class="lg:col-span-4">
        <SessionsPanel />
      </div>
    </main>

    <ToastContainer />
  </div>
</template>
