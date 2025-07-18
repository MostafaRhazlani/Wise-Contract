<template>
  <NodeViewWrapper :class="['column', { empty: isEmpty }]">
    <NodeViewContent />
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import { computed } from 'vue'
const props = defineProps(['node'])
const isEmpty = computed(() => {
    if (!props.node || props.node.content.size === 0) return true
    // Check if the only child is a paragraph and it's empty
    if (
        props.node.childCount === 1 &&
        props.node.firstChild.type.name === 'paragraph' &&
        props.node.firstChild.content.size === 0
    ) {
        return true
    }
    return false
});
</script>

<style scoped>
.column.empty {
  background: #eaf3fa;
}
.column {
  background: none;
}
</style> 