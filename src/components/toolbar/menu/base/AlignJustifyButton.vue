<template>
  <button
    :class="{ 'bg-green-100 text-green-500': props.editor?.isActive({ textAlign: 'justify' }) }"
    class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
    @click="handleAlignJustify"
    title="Justify"
  >
    <AlignJustify :size="18" />
  </button>
</template>

<script setup lang="ts">
import { AlignJustify } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'
const props = defineProps<{ editor: Editor | undefined }>()

function handleAlignJustify() {
    props.editor?.chain().focus().setTextAlign('justify').run()
}
</script>