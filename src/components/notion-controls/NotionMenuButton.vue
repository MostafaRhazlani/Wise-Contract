<template>
  <div>
    <button
      v-if="show"
      class="notion-side-menu-button absolute z-50 bg-white rounded-md w-6 h-6 flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
      :style="{ top: `${top}px`, left: `${left}px` }"
      @click="showMenu = !showMenu"
      title="Block options"
    >
      <GripVertical :size="16" class="text-gray-600" />
    </button>

    <!-- Block Options Popup -->
    <div
      v-if="showMenu"
      class="absolute z-60 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 pt-2"
      :style="{ top: `${top}px`, left: `${left + 30}px` }"
      @click.stop
    >
      <div class="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
        Block Actions
      </div>
      <div class="flex flex-col p-2 rounded">
        <DeleteButton 
          :editor="props.editor"
          :pos="props.pos"
          :pageIndex="props.pageIndex"
          @block-deleted="handleBlockDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GripVertical} from 'lucide-vue-next';
import { ref } from 'vue';
import type { Ref } from 'vue';
import DeleteButton from './menu-buttons/DeleteButton.vue';
import { Editor } from '@tiptap/core';

const showMenu: Ref<boolean> = ref(false);

const props = defineProps<{
  top: number;
  left: number;
  pageIndex: number;
  pos: number;
  show: boolean;
  editor?: Editor;
}>();

const emit = defineEmits<{
  'show-menu': [pageIndex: number, pos: number];
  'mouseenter': [];
  'mouseleave': [];
}>();

// Handle block deletion - close menu when block is deleted
const handleBlockDeleted = () => {
  showMenu.value = false;
};

</script>

<style scoped>
.notion-side-menu-button {
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.notion-side-menu-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}
</style>
