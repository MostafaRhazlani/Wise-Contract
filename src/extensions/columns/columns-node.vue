<template>
  <NodeViewWrapper class="columns mb-3 p-2" :class="{ 'selected': selected }" @click="hover = true" style="position: relative;">
    <button
      v-if="hover || selected"
      class="absolute top-4 -left-10 bg-white shadow-sm rounded-full z-10 p-2 border hover:text-red-500 hover:bg-red-300/50"
      @click="deleteNode"
    ><Trash2 :size="16"/>
    </button>
    <NodeViewContent class="flex w-full gap-3"/>
  </NodeViewWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import { Trash2 } from 'lucide-vue-next';
const props = defineProps(['editor', 'getPos', 'selected'])
const hover = ref(false)
const showMenu = ref(false)

function deleteNode() {
  const pos = props.getPos()
  const node = props.editor.state.doc.nodeAt(pos)
  if (node) {
    props.editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
  }
  showMenu.value = false
}
</script>

<style scoped>
.block-menu {
  position: absolute;
  left: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 20;
  padding: 4px 0;
}
.columns.selected {
  outline: 2px solid #4ade80;
}
</style> 