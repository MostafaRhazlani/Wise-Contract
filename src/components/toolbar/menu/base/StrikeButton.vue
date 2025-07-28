<template>
    <button @click="handleStrike"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('strike') }"
        class="p-2 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Strikethrough :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Strikethrough } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleStrike() {
    props.editor?.chain().focus().toggleStrike().run();
}
</script>
