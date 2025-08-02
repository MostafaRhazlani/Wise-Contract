<template>
    <el-tooltip :content="canToggleHeaderRow ? 'Toggle header row' : 'Move cursor inside a table to toggle header row'"
        placement="bottom">
        <button @click="toggleHeaderRow" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canToggleHeaderRow ? 'text-gray-500 hover:text-green-500 hover:bg-green-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canToggleHeaderRow">
            <Icon icon="tabler:freeze-row" width="20px" height="20px" />
            <span>Header Row</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can toggle header row (if we're in a table)
const canToggleHeaderRow = computed(() => {
    return props.editor && props.editor.can().toggleHeaderRow();
});

function toggleHeaderRow() {
    if (props.editor && canToggleHeaderRow.value) {
        props.editor.chain().focus().toggleHeaderRow().run();
    }
}
</script>

<style scoped></style>
