<template>
  <div class="">
    
    <div v-if="templateStore.loading" :class="gridClasses">
      <div class="animate-pulse">
        <div class="w-full h-52 bg-gray-200"></div>
      </div>
    </div>
    <div v-else-if="templateStore.error" class="text-red-500 text-sm">
      {{ templateStore.error }}
    </div>
    <div v-else :class="gridClasses">
      <div v-for="template in templateStore.templates" :key="template.id" @click="$emit('select-template', template.id)" class="cursor-pointer group">
        <div class="w-full bg-gray-100 rounded border overflow-hidden">
          <img :src="storageBaseUrl + template.image" alt="Template image" class="object-contain h-full w-full transition-transform" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTemplateStore } from '@/store/templateStore';
import { useRoute } from 'vue-router';

defineEmits(['select-template']);

const route = useRoute();
const templateStore = useTemplateStore();
const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL

// Computed for grid classes based on route
const gridClasses = computed(() => {
  if (route.name === 'EditorUsers') {
    return 'grid grid-cols-3 gap-4';
  } else {
    return 'grid grid-cols-2 gap-2';
  }
});
onMounted(() => {
  templateStore.getTemplatesCompanyWithType();
});
</script> 