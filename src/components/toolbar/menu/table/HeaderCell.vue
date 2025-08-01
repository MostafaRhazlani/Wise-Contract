<template>
    <el-tooltip
        :content="canToggleHeaderCell ? 'Toggle header cell' : 'Move cursor inside a table to toggle header cell'"
        placement="bottom">
        <button @click="toggleHeaderCell" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canToggleHeaderCell ? 'text-gray-500 hover:text-green-500 hover:bg-green-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canToggleHeaderCell">
            <Icon icon="tabler:freeze-row-column" width="20px" height="20px" />
            <span>Header Cell</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can toggle header cell (if we're in a table)
const canToggleHeaderCell = computed(() => {
    return props.editor && props.editor.can().toggleHeaderCell();
});

function toggleHeaderCell() {
    if (props.editor && canToggleHeaderCell.value) {
        props.editor.chain().focus().toggleHeaderCell().run();
    }
}
</script>

<style scoped></style>
