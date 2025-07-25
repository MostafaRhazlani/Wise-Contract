<template>
    <button @click="handleItalic"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('italic') }"
        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Italic :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Italic } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleItalic() {
    props.editor?.chain().focus().toggleItalic().run();
}
</script>
