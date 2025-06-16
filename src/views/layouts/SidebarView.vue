<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent } from 'vue'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'vue-router'
import {
  MenuIcon,
  HomeIcon,
  LayoutTemplateIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-vue-next'

interface SidebarItem {
  name: string
  icon: any
  active: boolean
}

const props = defineProps<{
  sidebarExpanded: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sidebarExpanded', value: boolean): void
}>()

const showProfileModal = ref(false)
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

const sidebarItems = ref<SidebarItem[]>([
  { name: 'Home', icon: HomeIcon, active: true },
  { name: 'Templates', icon: LayoutTemplateIcon, active: false },
])

// Methods
const toggleSidebar = () => {
  emit('update:sidebarExpanded', !props.sidebarExpanded)
}

const toggleProfileModal = () => {
  showProfileModal.value = !showProfileModal.value
}

const setActiveItem = (itemName: string) => {
  sidebarItems.value.forEach(item => {
    item.active = item.name === itemName
  })
}

const handleSettings = () => {
  showProfileModal.value = false
  router.push({ name: 'Settings' })
}

const handleLogout = () => {
  showProfileModal.value = false
  authStore.logout()
  router.push({ name: 'Login' })
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showProfileModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<script lang="ts">
export default defineComponent({
  name: 'SidebarView'
})
</script>

<template>
    <div class="fixed left-0 top-0 h-full bg-white shadow-lg z-10 transition-all duration-300 ease-in-out"
      :class="sidebarExpanded ? 'w-64' : 'w-16'">
      <!-- Menu Toggle -->
      <div class="p-3 border-b border-gray-100">
        <button @click="toggleSidebar"
          class="w-10 h-8 text-slate-900 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
          <MenuIcon class="w-6 h-6 mx-auto" />
        </button>
      </div>

      <!-- Navigation Items -->
      <nav class="mt-4 flex-1">
        <div v-for="item in sidebarItems" :key="item.name"
          class="flex items-center hover:bg-gray-50 cursor-pointer group transition-colors mx-2 rounded-lg"
          :class="{ 'bg-green-50': item.active }" @click="setActiveItem(item.name)">
          <div class="flex items-center w-full p-3">
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0"
              :class="item.active ? 'text-green-600' : 'text-gray-600'" />
            <span v-if="sidebarExpanded" class="ml-3 text-sm font-medium transition-opacity duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-700'">
              {{ item.name }}
            </span>
          </div>
        </div>
      </nav>

      <!-- Profile Section -->
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <div class="relative">
          <button @click="toggleProfileModal"
            class="flex items-center w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div
              class="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
            </div>
            <div v-if="sidebarExpanded" class="ml-3 text-left">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userEmail }}</p>
            </div>
          </button>

          <!-- Profile Modal -->
          <div v-if="showProfileModal"
            class="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            :class="sidebarExpanded ? 'w-full' : 'w-48'">
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
      </div>
    </div>
</template>

<style>
    
</style>