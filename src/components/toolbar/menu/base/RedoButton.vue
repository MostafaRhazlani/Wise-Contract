<template>
    <button :disabled="!editor?.can().redo()" @click="handleRedo"
        :class="{ 'hover:text-green-500 hover:bg-green-100': editor?.can().redo() }"
        class="p-2 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
        <Redo2 :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Redo2 } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleRedo() {
    props.editor?.chain().focus().redo().run();
}
</script>
