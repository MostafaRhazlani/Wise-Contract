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
          <SearchIcon
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search millions of templates"
            class="w-full pl-12 pr-12 py-4 bg-white rounded-2xl shadow-sm border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Design Type Icons -->
      <TemplateTypesList />
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

        <div class="mt-8">

          <!-- Loading state -->
          <div
            v-if="templateStore.loading"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <div
              v-for="n in filteredTemplates.length"
              :key="n"
              class="bg-white rounded-lg shadow-sm animate-pulse"
            >
              <div class="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
              <div class="p-4">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Error state -->
          <div
            v-else-if="templateStore.error"
            class="text-center p-8 bg-red-50 rounded-lg"
          >
            <p class="text-red-600 font-medium">Could not load templates.</p>
            <p class="text-gray-500 text-sm mt-1">{{ templateStore.error }}</p>
          </div>

          <!-- Designs Grid -->
          <div
            v-else-if="filteredTemplates.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              @click="selectTemplate(template.type.id, template.id)"
              class="bg-white rounded-lg cursor-pointer"
            >
              <div
                class="bg-gray-200 hover:bg-gray-300 hover:transition-all hover:duration-300 rounded-t-lg pt-4 overflow-hidden h-48 flex items-center justify-center"
                @mouseenter="handleMouseEnter(template)"
                @mouseleave="handleMouseLeave(template)"
              >
              <div v-if="template.pages && template.pages.length > 0" class="w-full h-full flex justify-center items-center overflow-hidden">
                <div class="w-2/3 h-full relative">
                  <transition name="slide-left" mode="out-in">
                    <img
                      :key="currentImageIndexes[template.id]"
                      :src="storageBaseUrl + template.pages[currentImageIndexes[template.id]]?.image_path"
                      alt=""
                      class="absolute w-full h-full shadow"
                    />
                  </transition>
                </div>
              </div>
              </div>
              <div class="p-4">
                <h3 class="font-medium text-gray-900 mb-1 truncate">Template</h3>
                <div class="flex items-center text-sm text-gray-500">
                  <component :is="getIconComponent(template.type.logo)" class="w-4 h-4 mr-1" :style="{ color: template.type.color }"></component>
                  <span>{{ template.type.title }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ new Date(template.updated_at).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else
            class="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg"
          >
            <h3 class="text-lg font-medium text-gray-800">No templates yet</h3>
            <p class="text-gray-500 mt-2">Create your first template to get started.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive, ref } from "vue";
import { useTemplateStore } from "@/store/templateStore";
import { useCompanyStore } from "@/store/companyStore";
import TemplateTypesList from "@/components/TemplateTypesList.vue";
import {
  SearchIcon,
  ArrowRightIcon,
  MoreHorizontalIcon,
} from "lucide-vue-next";
import * as icons from "lucide-vue-next";
import { useRouter } from 'vue-router'
import { setContent } from "@/plugins/indexedDb";

const router = useRouter();
const templateStore = useTemplateStore();
const companyStore = useCompanyStore();
const templates = computed(() => templateStore.templates);
const filteredTemplates = computed(() => templates.value.filter(t => t.type && t.type.title));
const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL

const getIconComponent = (iconName: string) => {
  const iconComponent = (icons as any)[iconName];
  return iconComponent;
};

// --- Carousel State ---
const currentImageIndexes = reactive<{ [templateId: number]: number }>({});
const hoverTimers = ref<{ [templateId: number]: any }>({});

const getCurrentImage = (template: any) => {
  const idx = currentImageIndexes[template.id] || 0;
  return template.pages && template.pages.length > 0
    ? template.pages[idx].image_path
    : '';
};

const handleMouseEnter = (template: any) => {
  if (!template.pages || template.pages.length <= 1) return;
  if (hoverTimers.value[template.id]) return; // already running
  hoverTimers.value[template.id] = setInterval(() => {
    const len = template.pages.length;
    currentImageIndexes[template.id] = (currentImageIndexes[template.id] + 1 || 1) % len;
  }, 1200); // 1.5s per slide
};

const handleMouseLeave = (template: any) => {
  if (hoverTimers.value[template.id]) {
    clearInterval(hoverTimers.value[template.id]);
    hoverTimers.value[template.id] = null;
  }
  currentImageIndexes[template.id] = 0;
};

const selectTemplate = (type_id: number, template_id: number) => {
  const template = templateStore.templates.find(el => el.id === template_id);
  // Use the first page's content_json if available
  if (template?.pages && template.pages.length > 0) {
    router.push({
      name: 'Editor',
      params: { type_id: type_id, template_id: template_id }
    });
  }
}

onMounted(async () => {
  await companyStore.getCompany();
  await templateStore.getTemplatesCompany();
  
  // Initialize all indexes to 0
  templateStore.templates.forEach(t => { currentImageIndexes[t.id] = 0; });
});
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

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  inset: 0;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.slide-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
