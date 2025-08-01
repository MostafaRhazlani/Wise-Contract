<template>
  <button
    :class="{ 'bg-green-100 text-green-500': props.editor?.isActive({ textAlign: 'center' }) }"
    class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
    @click="handleAlignCenter"
    title="Align Center"
  >
    <AlignCenter :size="18" />
  </button>
</template>

<script setup lang="ts">
import { AlignCenter } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'
const props = defineProps<{ editor: Editor | undefined }>()

function handleAlignCenter() {
    props.editor?.chain().focus().setTextAlign('center').run()
}
</script>