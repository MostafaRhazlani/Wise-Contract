<template>
    <el-tooltip
        :content="canInsertColumn ? 'Insert column after' : 'Move cursor inside a table to insert a column after'"
        placement="bottom">
        <button @click="insertColumnAfter" :class="['flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors',
            canInsertColumn ? 'text-gray-500 hover:text-green-500 hover:bg-green-100' : 'text-gray-400 cursor-not-allowed'
        ]" :disabled="!canInsertColumn">
            <Icon icon="tabler:column-insert-right" width="20px" height="20px" /> <span>Col After</span>
        </button>
    </el-tooltip>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { computed } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor }>();

// Check if we can insert a column (if we're in a table)
const canInsertColumn = computed(() => {
    return props.editor && props.editor.can().addColumnBefore();
});

function insertColumnAfter() {
    if (props.editor && canInsertColumn.value) {
        props.editor.chain().focus().addColumnAfter().run();
    }
}
</script>

<style scoped></style>
