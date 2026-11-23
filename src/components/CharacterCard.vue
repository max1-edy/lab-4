<script setup lang="ts">
import type { CharacterModel } from '@/types/greed'
import { useAvatarUrl } from '@/composables/useAvatarUrl'

defineProps<{
  character: CharacterModel
  selected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { resolveAvatar } = useAvatarUrl()
</script>

<template>
  <button
    type="button"
    class="btn btn-sm h-auto py-2 flex flex-col items-center gap-1"
    :class="selected ? 'btn-primary' : 'btn-outline border-base-300'"
    @click="emit('select', character.id)"
  >
    <img
      :src="resolveAvatar(character.avatar_url)"
      :alt="character.name"
      class="w-10 h-10 object-contain"
      style="image-rendering: pixelated;"
    />
    <span class="text-xs font-medium">{{ character.name }}</span>
  </button>
</template>
