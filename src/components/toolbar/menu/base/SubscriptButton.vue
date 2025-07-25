<template>
    <button @click="handleSubscript"
        :class="{ 'bg-green-100 text-green-500': editor?.isActive('subscript') }"
        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Subscript :size="18" />
    </button>
</template>

<script setup lang="ts">
import { Subscript } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

function handleSubscript() {
    props.editor?.chain().focus().toggleSubscript().run();
}
</script>
