<template>
  <div class="">
    <h3 class="font-semibold text-gray-800 mb-4">Templates</h3>
    <div v-if="templateStore.loading" class="grid grid-cols-2 gap-2">
      <div class="animate-pulse">
        <div class="w-full h-52 bg-gray-200"></div>
      </div>
    </div>
    <div v-else-if="templateStore.error" class="text-red-500 text-sm">
      {{ templateStore.error }}
    </div>
    <div v-else class="grid grid-cols-2 gap-2">
      <div v-for="template in templateStore.templates" :key="template.id" @click="$emit('select-template', template.id)" class="cursor-pointer group">
        <div class="w-full bg-gray-100 rounded border overflow-hidden">
          <img :src="storageBaseUrl + template.image" alt="Template image" class="object-contain h-full w-full transition-transform" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTemplateStore } from '@/store/templateStore';

defineEmits(['select-template']);

const templateStore = useTemplateStore();
const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL

onMounted(() => {
  templateStore.getTemplatesCompanyWithType();
});
</script> 