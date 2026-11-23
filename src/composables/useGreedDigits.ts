import { computed, type Ref } from 'vue'

export function useGreedDigits(coins: Ref<number>) {
  const clamped = computed(() => Math.max(0, Math.min(999, Math.floor(coins.value))))

  const hundreds = computed(() => Math.floor(clamped.value / 100))
  const tens = computed(() => Math.floor((clamped.value % 100) / 10))
  const units = computed(() => clamped.value % 10)

  return {
    hundreds,
    tens,
    units,
  }
}
