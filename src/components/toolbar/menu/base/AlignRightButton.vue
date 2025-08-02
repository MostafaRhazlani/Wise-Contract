<template>
  <button
    :class="{ 'bg-green-100 text-green-500': props.editor?.isActive({ textAlign: 'right' }) }"
    class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
    @click="handleAlignRight"
    title="Align Right"
  >
    <AlignRight :size="18" />
  </button>
</template>

<script setup lang="ts">
import { AlignRight } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'
const props = defineProps<{ editor: Editor | undefined }>()

function handleAlignRight() {
    props.editor?.chain().focus().setTextAlign('right').run()
}
</script>