<template>
  <div class="left-0 border-r border-gray-200 top-24 pt-2 bottom-0 flex z-20">
    <div class="flex flex-col items-center p-2 space-y-4">
      <!-- Variables Button -->
      <button @click="$emit('toggle-panel', 'variables')" title="Variables" :class="['group flex flex-col items-center justify-center space-y-1', props.activePanel === 'variables' ? 'text-green-600' : '']">
        <div :class="['p-1 transition-all duration-200 group-hover:bg-gray-100 rounded-md', props.activePanel === 'variables' ? 'shadow-md' : '']">
          <FileJson2 :size="24" :class="[props.activePanel === 'variables' ? 'text-green-600' : 'text-gray-600', 'transition-colors group-hover:text-green-600']"/>
        </div>
        <span :class="['text-xs font-semibold transition-colors', props.activePanel === 'variables' ? 'text-green-600' : 'text-gray-600', 'group-hover:text-green-600']">Variables</span>
      </button>
      
      <!-- Templates Button -->
      <button @click="$emit('toggle-panel', 'templates')" title="Templates" :class="['group flex flex-col items-center justify-center space-y-1', props.activePanel === 'templates' ? 'text-green-600' : '']">
        <div :class="['p-1 transition-all duration-200 group-hover:bg-gray-100 rounded-md', props.activePanel === 'templates' ? 'shadow-md' : '']">
          <LayoutTemplate :size="24" :class="[props.activePanel === 'templates' ? 'text-green-600' : 'text-gray-600', 'transition-colors group-hover:text-green-600']" />
        </div>
        <span :class="['text-xs font-semibold transition-colors', props.activePanel === 'templates' ? 'text-green-600' : 'text-gray-600', 'group-hover:text-green-600']">Templates</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileJson2, LayoutTemplate } from 'lucide-vue-next';

defineEmits(['toggle-panel']);
const props = defineProps<{ activePanel?: string }>();
</script>

