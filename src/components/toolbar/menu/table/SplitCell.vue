<template>
    <el-tooltip :content="canSplitCell ? 'Split cell into two' : 'Select a cell to split'" placement="bottom">
        <button @click="splitCell" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canSplitCell ? 'text-gray-500 hover:text-blue-500 hover:bg-blue-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canSplitCell">
            <Icon icon="flowbite:split-cells-outline" width="20px" height="20px" />
            <span>Split Cell</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can split a cell (if we're in a table and have a cell selected)
const canSplitCell = computed(() => {
    return props.editor && props.editor.can().splitCell();
});

function splitCell() {
    if (props.editor && canSplitCell.value) {
        props.editor.chain().focus().splitCell().run();
    }
}
</script>

<style scoped></style>
