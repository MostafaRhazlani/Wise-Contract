<template>
  <el-tooltip :content="canDeleteColumn ? 'Delete column' : 'Move cursor inside a table to delete a column'"
    placement="bottom">
    <button @click="deleteColumn" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm rounded-md transition-colors',
      canDeleteColumn ? 'text-gray-500 hover:text-red-500 hover:bg-red-100' : 'text-gray-400 cursor-not-allowed'
    ]" :disabled="!canDeleteColumn">
      <Icon icon="carbon:column-delete" width="20" height="20" /> <span>Delete Column</span>
    </button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElMessageBox, ElTooltip } from 'element-plus';

const props = defineProps<{ editor: Editor }>();

// Check if we can delete a column (if we're in a table)
const canDeleteColumn = computed(() => {
  return props.editor && props.editor.can().deleteColumn();
});

async function deleteColumn() {
  if (props.editor && canDeleteColumn.value) {
    try {
      await ElMessageBox.confirm(
        'Are you sure you want to delete this column? This action cannot be undone.',
        'Delete Column',
        {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning',
          confirmButtonClass: 'el-button--danger'
        }
      );
      // If user confirms, delete the column
      props.editor.chain().focus().deleteColumn().run();
    } catch (error) {
      // User cancelled the action, do nothing
      console.log('Delete column cancelled');
    }
  }
}
</script>

<style scoped></style>
