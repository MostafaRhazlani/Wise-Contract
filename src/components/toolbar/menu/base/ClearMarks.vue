<template>
    <button :disabled="!editor?.can().unsetAllMarks()" @click="handleRedo"
        class="hover:text-green-500 hover:bg-green-100 p-2 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
        <Eraser :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Eraser } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleRedo() {
    props.editor?.chain().focus().unsetAllMarks().run()
}
</script>
