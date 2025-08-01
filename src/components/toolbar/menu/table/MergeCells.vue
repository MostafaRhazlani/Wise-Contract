<template>
  <el-tooltip
    :content="canMergeCells ? 'Merge selected cells' : 'Select multiple cells to merge'"
    placement="bottom"
  >
    <button 
      @click="mergeCells"
      :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
        canMergeCells ? 'text-gray-500 hover:text-blue-500 hover:bg-blue-100' : 'text-gray-400 cursor-not-allowed'
      ]"
      :disabled="!canMergeCells"
    >
      <Icon icon="flowbite:merge-cells-outline" width="20px" height="20px" />      
      <span>Merge Cells</span>
    </button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can merge cells (if we're in a table and have multiple cells selected)
const canMergeCells = computed(() => {
  return props.editor && props.editor.can().mergeCells();
});

function mergeCells() {
  if (props.editor && canMergeCells.value) {
    props.editor.chain().focus().mergeCells().run();
  }
}
</script>

<style scoped></style>
