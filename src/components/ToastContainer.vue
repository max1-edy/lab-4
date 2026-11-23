<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import type { ToastType } from '@/types/greed'

const toastStore = useToastStore()

function alertClass(type: ToastType): string {
  if (type === 'success') return 'alert-success'
  if (type === 'warning') return 'alert-warning'
  if (type === 'error') return 'alert-error'
  return 'alert-info'
}
</script>

<template>
  <div class="toast toast-bottom toast-end z-50 max-w-sm">
    <div
      v-for="item in toastStore.toasts"
      :key="item.id"
      class="alert shadow-md text-sm py-2.5 cursor-pointer"
      :class="alertClass(item.type)"
      @click="toastStore.removeToast(item.id)"
    >
      <span>{{ item.message }}</span>
    </div>
  </div>
</template>
