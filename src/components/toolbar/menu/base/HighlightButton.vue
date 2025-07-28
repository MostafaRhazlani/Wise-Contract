<template>
  <button
    :class="{
      'bg-green-100 text-green-500': props.selectedColor.highlight,
      'p-2 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors' : true
    }"
    :disabled="!editor"
    title="Highlight"
  >
    <Highlighter 
      :size="18" 
      :style="{
        color: props.selectedColor.highlight
      }"/>
  </button>
</template>

<script setup lang="ts">
import { Highlighter } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3'

const props = defineProps<{ 
  editor: Editor | undefined,
  selectedColor: {
    color: string,
    highlight: string
  },
}>();
</script>