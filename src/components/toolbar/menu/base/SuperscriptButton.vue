<template>
    <button @click="handleSuperscript"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('superscript') }"
        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Superscript :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Superscript } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleSuperscript() {
    props.editor?.chain().focus().toggleSuperscript().run();
}
</script>
