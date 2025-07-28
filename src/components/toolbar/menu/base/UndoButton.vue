<template>
  <button
    :disabled="!editor?.can().undo()"
    @click="handleUndo"
    :class="{ 'hover:text-green-500 hover:bg-green-100': editor?.can().undo() }"
    class="p-2 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Undo2 :size="18" />
  </button>
</template>

<script setup lang="ts">
import { Undo2 } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleUndo() {
  props.editor?.chain().focus().undo().run();
}
</script>
