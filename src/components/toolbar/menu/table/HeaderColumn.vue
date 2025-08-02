<template>
    <el-tooltip
        :content="canToggleHeaderColumn ? 'Toggle header column' : 'Move cursor inside a table to toggle header column'"
        placement="bottom">
        <button @click="toggleHeaderColumn" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canToggleHeaderColumn ? 'text-gray-500 hover:text-green-500 hover:bg-green-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canToggleHeaderColumn">
            <Icon icon="tabler:freeze-column" width="20px" height="20px" />
            <span>Header Col</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can toggle header column (if we're in a table)
const canToggleHeaderColumn = computed(() => {
    return props.editor && props.editor.can().toggleHeaderColumn();
});

function toggleHeaderColumn() {
    if (props.editor && canToggleHeaderColumn.value) {
        props.editor.chain().focus().toggleHeaderColumn().run();
    }
}
</script>

<style scoped></style>
