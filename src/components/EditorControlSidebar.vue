<template>
  <div class="left-0 border-r border-gray-200 top-24 pt-2 bottom-0 flex z-20">
    <div class="flex flex-col items-center p-2 space-y-2">
      <!-- Variables Icon -->
      <button @click="$emit('toggle-panel', 'variables')"
              title="Variables"
              class="flex flex-col items-center justify-center">
        <FileJson2 :size="40" class="text-gray-600 rounded-md hover:bg-gray-100 hover:text-green-600 transition-colors p-2" />
        <span class="text-xs font-semibold text-gray-600 mt-1">Variables</span>
      </button>
      
      <!-- Templates Icon -->
      <button @click="$emit('toggle-panel', 'templates')"
              title="Templates"
              class="flex flex-col items-center justify-center">
        <LayoutTemplate :size="40" class="text-gray-600 rounded-md hover:bg-gray-100 hover:text-green-600 transition-colors p-2" />
        <span class="text-xs font-semibold text-gray-600 mt-1">Templates</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileJson2, LayoutTemplate } from 'lucide-vue-next';

defineEmits(['toggle-panel']);
</script>

