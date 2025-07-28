<template>
    <button @click="handleBold"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('bold') }"
        class="p-2 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Bold stroke-width="3" :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Bold } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleBold() {
    props.editor?.chain().focus().toggleBold().run();
}
</script>
