<template>
    <div class="grid grid-cols-3 gap-1">
      <!-- Main Button -->
      <button
        v-for="heading in headings"
        :key="heading.level"
        :class="['p-2 rounded transition-colors', props.editor?.isActive('heading', { level: heading.level }) ? 'bg-green-100 text-green-500' : 'hover:bg-green-100 hover:text-green-500']"
        @click="applyHeading(heading.level)"
        title="Heading Size"
      >
        <component :is="getIconComponent(heading.icon)" :size="18" />
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import { Editor } from '@tiptap/vue-3';
  import * as icons from 'lucide-vue-next';
  
  const props = defineProps<{ editor: Editor | undefined }>();
  const showDropdown: Ref<boolean> = ref(false);
  
  const headings = [
    { level: 1, label: 'Heading 1', icon: 'Heading1' },
    { level: 2, label: 'Heading 2', icon: 'Heading2' },
    { level: 3, label: 'Heading 3', icon: 'Heading3' },
    { level: 4, label: 'Heading 4', icon: 'Heading4' },
    { level: 5, label: 'Heading 5', icon: 'Heading5' },
    { level: 6, label: 'Heading 6', icon: 'Heading6' },
  ];

  const getIconComponent = (iconName: string) => {
  const iconComponent = (icons as any)[iconName];
  return iconComponent;
};
  
  function applyHeading(level: number) {
    props.editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
    showDropdown.value = false;
  }
  </script>