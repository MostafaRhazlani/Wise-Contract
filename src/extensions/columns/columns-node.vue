<template>
  <NodeViewWrapper class="columns mb-3 p-2" :class="{ 'selected': selected }" @click="hover = true" style="position: relative;">
    <NodeViewContent class="flex w-full gap-3"/>
  </NodeViewWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
const props = defineProps(['editor', 'getPos', 'selected'])
const hover = ref(false)
</script>

<style scoped>
.columns.selected {
  outline: 2px solid #4ade80;
}
</style> 