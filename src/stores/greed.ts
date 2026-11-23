import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { greedService } from '@/services/greedService'
import { useSessionStore } from '@/stores/session'
import { useToastStore } from '@/stores/toast'
import { usePayloadRunner } from '@/composables/usePayloadRunner'
import type { CharacterModel, GreedStateModel } from '@/types/greed'

export const useGreedStore = defineStore('greed', () => {
  const sessionStore = useSessionStore()
  const toastStore = useToastStore()
  const { runPayload } = usePayloadRunner()

  const characters = ref<CharacterModel[]>([])
  const state = ref<GreedStateModel | null>(null)
  const isLoading = ref(false)
  const isActionBusy = ref(false)
  const isShaking = ref(false)

  const coinsInMachine = computed(() => state.value?.coins_in_machine ?? 0)
  const canDonate = computed(
    () =>
      Boolean(state.value) &&
      !isActionBusy.value &&
      !state.value!.is_jammed &&
      state.value!.wallet > 0,
  )
  const canBomb = computed(
    () => Boolean(state.value) && !isActionBusy.value && state.value!.bombs > 0,
  )

  function syncSavedSession(nextState: GreedStateModel) {
    sessionStore.setActiveSession(nextState.session_id)
    sessionStore.saveSession({
      id: nextState.session_id,
      name: nextState.name || 'Сесія автомата',
      characterId: nextState.character.id,
      characterName: nextState.character.name,
    })
  }

  function triggerShake() {
    isShaking.value = false
    window.requestAnimationFrame(() => {
      isShaking.value = true
      window.setTimeout(() => {
        isShaking.value = false
      }, 500)
    })
  }

  async function loadCharacters() {
    isLoading.value = true
    try {
      characters.value = await greedService.getCharacters()
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  async function createNewSession(characterId?: string, customName?: string) {
    isLoading.value = true
    try {
      const nextState = await greedService.createSession({
        character_id: characterId || 'isaac',
        custom_name: customName?.trim() || null,
      })
      state.value = nextState
      syncSavedSession(nextState)
      toastStore.showToast(`Створено сесію ${nextState.session_id}`, 'success')
    } catch {
      return
    } finally {
      isLoading.value = false
    }
  }

  async function connectSessionById(rawSessionId: string): Promise<boolean> {
    const cleanId = rawSessionId.trim()
    if (!cleanId) {
      toastStore.showToast('Введіть ID сесії для підключення.', 'warning')
      return false
    }

    isLoading.value = true
    try {
      const check = await greedService.verifySession(cleanId)
      if (!check.valid) {
        toastStore.showToast('Вказаний ID сесії невалідний.', 'error')
        return false
      }

      sessionStore.setActiveSession(cleanId)
      const nextState = await greedService.getState()
      state.value = nextState
      syncSavedSession(nextState)
      toastStore.showToast(`Підключено до сесії: ${nextState.name}`, 'info')
      return true
    } catch {
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function restoreActiveSession() {
    if (!sessionStore.activeSessionId) return
    const ok = await connectSessionById(sessionStore.activeSessionId)
    if (!ok) {
      sessionStore.setActiveSession('')
      state.value = null
    }
  }

  async function selectCharacter(characterId: string) {
    if (!state.value) {
      await createNewSession(characterId)
      return
    }

    isActionBusy.value = true
    try {
      const nextState = await greedService.selectCharacter(characterId)
      state.value = nextState
      syncSavedSession(nextState)
      toastStore.showToast(`Обрано персонажа: ${nextState.character.name}`, 'info')
    } catch {
      return
    } finally {
      isActionBusy.value = false
    }
  }

  async function donate() {
    if (!state.value || isActionBusy.value) return
    isActionBusy.value = true
    try {
      const res = await greedService.donateCoin()
      state.value = {
        ...state.value,
        wallet: res.wallet,
        coins_in_machine: res.coins_in_machine,
        jam_chance: res.jam_chance,
        is_jammed: res.is_jammed,
      }

      if (res.is_jammed) {
        triggerShake()
      }

      if (res.payload?.code) {
        runPayload(res.payload)
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409 && state.value) {
        state.value = {
          ...state.value,
          is_jammed: true,
        }
        triggerShake()
      }
    } finally {
      isActionBusy.value = false
    }
  }

  async function useBomb() {
    if (!state.value || isActionBusy.value) return
    isActionBusy.value = true
    try {
      const res = await greedService.useBomb()
      state.value = {
        ...state.value,
        coins_in_machine: res.coins_in_machine,
        wallet: res.wallet,
        bombs: res.bombs,
        is_jammed: res.is_jammed,
        is_exploded: res.is_exploded,
      }
      triggerShake()
    } catch {
      return
    } finally {
      isActionBusy.value = false
    }
  }

  async function resetAttempt(resetMachine = false) {
    if (!state.value || isActionBusy.value) return
    isActionBusy.value = true
    try {
      const nextState = await greedService.resetSession({
        character_id: state.value.character.id,
        reset_machine: resetMachine,
      })
      state.value = nextState
      syncSavedSession(nextState)
      toastStore.showToast(
        resetMachine ? 'Спробу та лічильник автомата скинуто.' : 'Спробу скинуто, гаманець відновлено.',
        'info',
      )
    } catch {
      return
    } finally {
      isActionBusy.value = false
    }
  }

  async function removeSavedSession(id: string) {
    const wasActive = sessionStore.activeSessionId === id
    sessionStore.removeSession(id)
    if (wasActive) {
      if (sessionStore.activeSessionId) {
        await connectSessionById(sessionStore.activeSessionId)
      } else {
        state.value = null
      }
    }
  }

  return {
    characters,
    state,
    isLoading,
    isActionBusy,
    isShaking,
    coinsInMachine,
    canDonate,
    canBomb,
    loadCharacters,
    createNewSession,
    connectSessionById,
    restoreActiveSession,
    selectCharacter,
    donate,
    useBomb,
    resetAttempt,
    removeSavedSession,
  }
})
