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
    <div v-else-if="displayTemplates.length === 0" class="text-gray-500 text-center py-8">
      No templates found for the selected filter.
    </div>
    <div v-else :class="gridClasses">
      <div 
        v-for="template in displayTemplates" 
        :key="template.id" 
        @click="$emit('select-template', template.id)" 
        :class="[
          'cursor-pointer transition-transform duration-700',
          selectedTemplate === String(template.id)
            ? 'border-2 border-green-500 bg-green-50 rounded-lg p-1' : ''
        ]"
      >
        <div class="w-full bg-gray-100 rounded border overflow-hidden">
          <img 
            :src="storageBaseUrl + template.image" 
            :alt="`${template.name || 'Template'} image`" 
            class="object-contain h-full w-full" 
          />
        </div>
        
        <!-- Show template info when in modal -->
        <div v-if="route.name === 'EditorUsers'" class="mt-2 text-center">
          <h4 class="font-medium text-sm truncate">{{ template.template_name || 'Untitled' }}</h4>
          <p class="text-xs text-gray-500">{{ getTypeName(template.type_id) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTemplateStore } from '@/store/templateStore';
import { useTypeStore } from '@/store/typeStore';
import { useRoute } from 'vue-router';

// Props
const props = defineProps<{
  selectedTemplate?: string;
  templates?: any[]; // Filtered templates from parent
}>();

// Emits
defineEmits(['select-template']);

const route = useRoute();
const templateStore = useTemplateStore();
const typeStore = useTypeStore();
const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;

// Use templates from props if provided (filtered), otherwise use store templates
const displayTemplates = computed(() => {
  return props.templates || templateStore.templates;
});

// Computed for grid classes based on route
const gridClasses = computed(() => {
  if (route.name === 'EditorUsers') {
    return 'grid grid-cols-3 gap-4';
  } else {
    return 'grid grid-cols-2 gap-2';
  }
});

// Get type name by ID
function getTypeName(typeId: number) {
  const type = typeStore.types.find(t => t.id === typeId);
  return type ? type.title : 'No Type';
}

onMounted(async () => {

  // Only load templates if not provided via props (not in modal)
  if (templateStore.templates.length === 0) {
    await templateStore.getTemplatesCompanyWithType(Number(route.params.type_id));
  }
    
  // }
});
</script>