<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { Bell } from 'lucide-vue-next';
import UserProfileModal from '../../components/UserProfileModal.vue';

const props = defineProps<{
  sidebarExpanded: boolean;
}>();

const route = useRoute();
const authStore = useAuthStore();
const showProfileModal = ref(false);

// Add computed property for role-based access
const canAccessManagerDashboard = computed(() => {
  const role = authStore.userRole;
  return role === 1 || role === 3;
});

// user data
const userName = computed(() => authStore.user?.name || '');
const userEmail = computed(() => authStore.user?.email || '');

// get first character from first name and last name
const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();
});

// Handle click outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.profile-section')) {
    showProfileModal.value = false;
  }
};

// Add event listener for click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header v-if="canAccessManagerDashboard" 
    class="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 z-10 transition-all duration-300 ease-in-out"
    :class="!route.meta.showSidebar ? 'lg:ml-0' : (props.sidebarExpanded ? 'lg:ml-64' : 'lg:ml-16')">
    <div class="h-full px-4 flex items-center justify-between">
      <h1 class="text-lg font-semibold text-gray-900">Logo</h1>

      <div class="flex items-center space-x-4">
        <div class="relative profile-section">
          <button 
            @click="showProfileModal = !showProfileModal"
            class="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
            </div>
          </button>

          <UserProfileModal v-model:show="showProfileModal" position="top" />
        </div>
      </div>
    </div>
  </header>
</template>

<style>
    
</style>