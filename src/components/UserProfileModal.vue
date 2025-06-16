<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'
import { SettingsIcon, LogOutIcon } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  position?: 'top' | 'bottom'
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const authStore = useAuthStore()
const router = useRouter()

// user data
const userName = computed(() => authStore.user?.name || '')
const userEmail = computed(() => authStore.user?.email || '')

// get first character from first name and last name
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
})

const handleSettings = () => {
  emit('update:show', false)
  router.push({ name: 'Settings' })
}

const handleLogout = () => {
  emit('update:show', false)
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div v-if="show" 
    class="bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
    :class="[
      position === 'top' ? 'absolute right-0 mt-2' : 'absolute bottom-full left-0 mb-2',
      'w-72'
    ]">
    <div class="p-4 border-b">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-lg font-semibold">{{ userInitials }}</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ userName }}</h3>
          <p class="text-sm text-gray-500">{{ userEmail }}</p>
        </div>
      </div>
    </div>
    <div class="p-2">
      <button @click="handleSettings"
        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <SettingsIcon class="w-4 h-4 mr-3" />
        Settings
      </button>
      <button @click="handleLogout"
        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
        <LogOutIcon class="w-4 h-4 mr-3" />
        Logout
      </button>
    </div>
  </div>
</template> 