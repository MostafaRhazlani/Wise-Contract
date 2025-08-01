<template>
    <el-tooltip :content="canInsertRow ? 'Insert row above' : 'Move cursor inside a table to insert a row above'"
        placement="bottom">
        <button @click="insertRowAbove" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canInsertRow ? 'text-gray-500 hover:text-green-500 hover:bg-green-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canInsertRow">
            <Icon icon="tabler:row-insert-top" width="20px" height="20px" />
            <span>Row Above</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can insert a row (if we're in a table)
const canInsertRow = computed(() => {
    return props.editor && props.editor.can().addRowBefore();
});

function insertRowAbove() {
    if (props.editor && canInsertRow.value) {
        props.editor.chain().focus().addRowBefore().run();
    }
}
</script>

<style scoped></style>
