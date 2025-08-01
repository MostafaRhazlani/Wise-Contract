<template>
    <el-tooltip :content="canDeleteRow ? 'Delete row' : 'Move cursor inside a table to delete a row'"
        placement="bottom">
        <button @click="deleteRow" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canDeleteRow ? 'text-gray-500 hover:text-red-500 hover:bg-red-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canDeleteRow">
            <Icon icon="carbon:row-delete" width="20" height="20" />
            <span>Delete Row</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElMessageBox, ElTooltip } from 'element-plus';

const props = defineProps<{ editor: Editor }>();

// Check if we can delete a row (if we're in a table)
const canDeleteRow = computed(() => {
    return props.editor && props.editor.can().deleteRow();
});

async function deleteRow() {
    if (props.editor && canDeleteRow.value) {
        try {
            await ElMessageBox.confirm(
                'Are you sure you want to delete this row? This action cannot be undone.',
                'Delete Row',
                {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    confirmButtonClass: 'el-button--danger'
                }
            );
            // If user confirms, delete the row
            props.editor.chain().focus().deleteRow().run();
        } catch (error) {
            // User cancelled the action, do nothing
            console.log('Delete row cancelled');
        }
    }
}
</script>

<style scoped></style>
