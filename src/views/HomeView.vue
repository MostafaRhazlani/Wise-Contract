<template>
    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out">
      <!-- Header -->
      <header class="px-8 pt-8 pb-6">
        <div class="flex justify-between items-start mb-8">
          <div class="flex-1">
            <h1 class="text-5xl font-bold text-center text-green-600 mb-8">
              What will you design today?
            </h1>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto mb-12">
          <div class="relative">
            <SearchIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search millions of templates"
              class="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-sm border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <ArrowRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Design Type Icons -->
        <div class="flex justify-center space-x-6 mb-12">
          <div v-for="templateTypes in templateTypes" :key="templateTypes.name"
            class="flex flex-col items-center cursor-pointer group" @click="selectTemplateTypes(templateTypes)">
            <div @click="chooseType(templateTypes)"
              class="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg transition-transform group-hover:scale-105 relative"
              :style="{ backgroundColor: templateTypes.color }">
              <component :is="templateTypes.icon" class="w-8 h-8 text-white" />
              <span v-if="templateTypes.badge"
                class="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {{ templateTypes.badge }}
              </span>
            </div>
            <span class="text-sm text-gray-700 font-medium">{{ templateTypes.name }}</span>
          </div>
        </div>
      </header>

      <!-- Recent Templates Section -->
      <section class="px-4 pb-4">
        <div class="bg-white shadow-md p-4 rounded-lg">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Recent Templates</h2>
            <button class="text-gray-600 hover:text-gray-900">
              <MoreHorizontalIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Designs Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            <div v-for="template in recentTemplates" :key="template.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div class="aspect-[4/3] bg-gray-100 rounded-t-lg overflow-hidden relative">
                <img :src="template.thumbnail" :alt="template.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                <div v-if="template.viewOnly"
                  class="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  View only
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 mb-1 truncate">{{ template.title }}</h3>
                <div class="flex items-center text-sm text-gray-500">
                  <component :is="template.typeIcon" class="w-4 h-4 mr-1" :style="{ color: template.typeColor }" />
                  <span>{{ template.type }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ template.lastEdited }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'vue-router'
import {
  SearchIcon,
  ArrowRightIcon,
  FileTextIcon,
  ReceiptText,
  MoreHorizontalIcon,
  FileUser,
} from 'lucide-vue-next'

interface TemplateTypes {
  name: string
  icon: any
  color: string
  badge?: string
}

interface RecentTemplate {
  id: number
  title: string
  thumbnail: string
  type: string
  typeIcon: any
  typeColor: string
  lastEdited: string
  viewOnly?: boolean
}

const isMobile = ref(false)
const router = useRouter()

const templateTypes = ref<TemplateTypes[]>([
  { name: 'Document', icon: FileTextIcon, color: '#06b6d4' },
  { name: 'CV', icon: FileUser, color: '#10b981' },
  { name: 'Contrat', icon: ReceiptText, color: '#f97316' },
])

const recentTemplates = ref<RecentTemplate[]>([
  {
    id: 1,
    title: 'My Contract',
    thumbnail: '',
    type: 'Presentation',
    typeIcon: ReceiptText,
    typeColor: '#f97316',
    lastEdited: '12h ago'
  },
])

const selectTemplateTypes = (templateTypes: TemplateTypes) => {
  console.log('Design type selected:', templateTypes.name)
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const chooseType = (templateTypes: TemplateTypes) => {
  router.push({
    name: 'Editor',
    params: { type: templateTypes.name.toLowerCase() }
  })
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Profile modal animation */
.relative .absolute {
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>