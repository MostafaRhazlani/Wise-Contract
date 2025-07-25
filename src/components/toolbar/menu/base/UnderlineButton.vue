<template>
    <button @click="handleUnderline"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('underline') }"
        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Underline :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Underline } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleUnderline() {
    props.editor?.chain().focus().toggleUnderline().run();
}
</script>
