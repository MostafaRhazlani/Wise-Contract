<template>
  <button
    :class="{ 'bg-green-100 text-green-500': props.editor?.isActive({ textAlign: 'left' }) }"
    class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
    @click="handleAlignLeft"
    title="Align Left"
  >
    <AlignLeft :size="18" />
  </button>
</template>

<script setup lang="ts">
import { AlignLeft } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'
const props = defineProps<{ editor: Editor | undefined }>()

function handleAlignLeft() {
    props.editor?.chain().focus().setTextAlign('left').run()
}
</script>